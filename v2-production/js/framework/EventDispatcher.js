"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
var ArrayUtils_1 = require("./utils/ArrayUtils");
var Timeout_1 = require("./utils/Timeout");
/**
 * Event dispatcher to subscribe and trigger events. Each event should have its own dispatcher.
 */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.listeners = [];
    }
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribe = function (listener) {
        this.listeners.push(new EventListenerWrapper(listener));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribeOnce = function (listener) {
        this.listeners.push(new EventListenerWrapper(listener, true));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.subscribeRateLimited = function (listener, rateMs) {
        this.listeners.push(new RateLimitedEventListenerWrapper(listener, rateMs));
    };
    /**
     * {@inheritDoc}
     */
    EventDispatcher.prototype.unsubscribe = function (listener) {
        // Iterate through listeners, compare with parameter, and remove if found
        // NOTE: In case we ever remove all matching listeners instead of just the first, we need to reverse-iterate here
        for (var i = 0; i < this.listeners.length; i++) {
            var subscribedListener = this.listeners[i];
            if (subscribedListener.listener === listener) {
                subscribedListener.clear();
                ArrayUtils_1.ArrayUtils.remove(this.listeners, subscribedListener);
                return true;
            }
        }
        return false;
    };
    /**
     * Removes all listeners from this dispatcher.
     */
    EventDispatcher.prototype.unsubscribeAll = function () {
        // In case of RateLimitedEventListenerWrapper we need to make sure that the timeout callback won't be called
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener.clear();
        }
        this.listeners = [];
    };
    /**
     * Dispatches an event to all subscribed listeners.
     * @param sender the source of the event
     * @param args the arguments for the event
     */
    EventDispatcher.prototype.dispatch = function (sender, args) {
        if (args === void 0) { args = null; }
        var listenersToRemove = [];
        // Call every listener
        // We iterate over a copy of the array of listeners to avoid the case where events are not fired on listeners when
        // listeners are unsubscribed from within the event handlers during a dispatch (because the indices change and
        // listeners are shifted within the array).
        // This means that listener x+1 will still be called if unsubscribed from within the handler of listener x, as well
        // as listener y+1 will not be called when subscribed from within the handler of listener y.
        // Array.slice(0) is the fastest array copy method according to: https://stackoverflow.com/a/21514254/370252
        var listeners = this.listeners.slice(0);
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener.fire(sender, args);
            if (listener.isOnce()) {
                listenersToRemove.push(listener);
            }
        }
        // Remove one-time listener
        for (var _a = 0, listenersToRemove_1 = listenersToRemove; _a < listenersToRemove_1.length; _a++) {
            var listenerToRemove = listenersToRemove_1[_a];
            ArrayUtils_1.ArrayUtils.remove(this.listeners, listenerToRemove);
        }
    };
    /**
     * Returns the event that this dispatcher manages and on which listeners can subscribe and unsubscribe event handlers.
     * @returns {Event}
     */
    EventDispatcher.prototype.getEvent = function () {
        // For now, just cast the event dispatcher to the event interface. At some point in the future when the
        // codebase grows, it might make sense to split the dispatcher into separate dispatcher and event classes.
        return this;
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
/**
 * A basic event listener wrapper to manage listeners within the {@link EventDispatcher}. This is a 'private' class
 * for internal dispatcher use and it is therefore not exported.
 */
var EventListenerWrapper = /** @class */ (function () {
    function EventListenerWrapper(listener, once) {
        if (once === void 0) { once = false; }
        this.eventListener = listener;
        this.once = once;
    }
    Object.defineProperty(EventListenerWrapper.prototype, "listener", {
        /**
         * Returns the wrapped event listener.
         * @returns {EventListener<Sender, Args>}
         */
        get: function () {
            return this.eventListener;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Fires the wrapped event listener with the given arguments.
     * @param sender
     * @param args
     */
    EventListenerWrapper.prototype.fire = function (sender, args) {
        this.eventListener(sender, args);
    };
    /**
     * Checks if this listener is scheduled to be called only once.
     * @returns {boolean} once if true
     */
    EventListenerWrapper.prototype.isOnce = function () {
        return this.once;
    };
    EventListenerWrapper.prototype.clear = function () { };
    return EventListenerWrapper;
}());
/**
 * Extends the basic {@link EventListenerWrapper} with rate-limiting functionality.
 */
var RateLimitedEventListenerWrapper = /** @class */ (function (_super) {
    __extends(RateLimitedEventListenerWrapper, _super);
    function RateLimitedEventListenerWrapper(listener, rateMs) {
        var _this = _super.call(this, listener) || this; // sets the event listener sink
        _this.rateMs = rateMs;
        // starting limiting the events to the given value
        var startRateLimiting = function () {
            _this.rateLimitTimout.start();
        };
        // timout for limiting the events
        _this.rateLimitTimout = new Timeout_1.Timeout(_this.rateMs, function () {
            if (_this.lastSeenEvent) {
                _this.fireSuper(_this.lastSeenEvent.sender, _this.lastSeenEvent.args);
                startRateLimiting(); // start rateLimiting again to keep rate limit active even after firing the last seen event
                _this.lastSeenEvent = null;
            }
        });
        // In case the events stopping during the rateLimiting we need to track the last seen one and delegate after the
        // rate limiting is finished. This prevents missing the last update due to the rate limit.
        _this.rateLimitingEventListener = function (sender, args) {
            // only fire events if the rateLimiting is not running
            if (_this.shouldFireEvent()) {
                _this.fireSuper(sender, args);
                startRateLimiting();
                return;
            }
            _this.lastSeenEvent = {
                sender: sender,
                args: args,
            };
        };
        return _this;
    }
    RateLimitedEventListenerWrapper.prototype.shouldFireEvent = function () {
        return !this.rateLimitTimout.isActive();
    };
    RateLimitedEventListenerWrapper.prototype.fireSuper = function (sender, args) {
        // Fire the actual external event listener
        _super.prototype.fire.call(this, sender, args);
    };
    RateLimitedEventListenerWrapper.prototype.fire = function (sender, args) {
        // Fire the internal rate-limiting listener instead of the external event listener
        this.rateLimitingEventListener(sender, args);
    };
    RateLimitedEventListenerWrapper.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.rateLimitTimout.clear();
    };
    return RateLimitedEventListenerWrapper;
}(EventListenerWrapper));
