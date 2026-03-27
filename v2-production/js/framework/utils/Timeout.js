"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeout = void 0;
// TODO change to internal (not exported) class, how to use in other files?
/**
 * Executes a callback after a specified amount of time, optionally repeatedly until stopped.
 */
var Timeout = /** @class */ (function () {
    /**
     * Creates a new timeout callback handler.
     * @param delay the delay in milliseconds after which the callback should be executed
     * @param callback the callback to execute after the delay time
     * @param repeat if true, call the callback repeatedly in delay intervals
     */
    function Timeout(delay, callback, repeat) {
        if (repeat === void 0) { repeat = false; }
        this.delay = delay;
        this.callback = callback;
        this.repeat = repeat;
        this.timeoutOrIntervalId = 0;
        this.active = false;
        this.suspended = false;
    }
    /**
     * Starts the timeout and calls the callback when the timeout delay has passed. Has no effect when the timeout is
     * suspended.
     * @returns {Timeout} the current timeout (so the start call can be chained to the constructor)
     */
    Timeout.prototype.start = function () {
        this.reset();
        return this;
    };
    /**
     * Clears the timeout. The callback will not be called if clear is called during the timeout.
     */
    Timeout.prototype.clear = function () {
        this.clearInternal();
    };
    /**
     * Suspends the timeout. The callback will not be called and calls to `start` and `reset` will be ignored until the
     * timeout is resumed.
     */
    Timeout.prototype.suspend = function () {
        this.suspended = true;
        this.clearInternal();
        return this;
    };
    /**
     * Resumes the timeout.
     * @param reset whether to reset the timeout after resuming
     */
    Timeout.prototype.resume = function (reset) {
        this.suspended = false;
        if (reset) {
            this.reset();
        }
        return this;
    };
    /**
     * Resets the passed timeout delay to zero. Can be used to defer the calling of the callback. Has no effect if the
     * timeout is suspended.
     */
    Timeout.prototype.reset = function () {
        var _this = this;
        this.clearInternal();
        if (this.suspended) {
            return;
        }
        if (this.repeat) {
            this.timeoutOrIntervalId = setInterval(this.callback, this.delay);
        }
        else {
            this.timeoutOrIntervalId = setTimeout(function () {
                _this.active = false;
                _this.callback();
            }, this.delay);
        }
        this.active = true;
    };
    Timeout.prototype.isActive = function () {
        return this.active;
    };
    Timeout.prototype.clearInternal = function () {
        if (this.repeat) {
            clearInterval(this.timeoutOrIntervalId);
        }
        else {
            clearTimeout(this.timeoutOrIntervalId);
        }
        this.active = false;
    };
    return Timeout;
}());
exports.Timeout = Timeout;
