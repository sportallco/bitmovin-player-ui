"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEventSubscriber = void 0;
/**
 * Allows to subscribe to Node events.
 */
var NodeEventSubscriber = /** @class */ (function () {
    function NodeEventSubscriber() {
        this.attachedListeners = new Map();
    }
    NodeEventSubscriber.prototype.getEventListenersOfType = function (type) {
        if (!this.attachedListeners.has(type)) {
            this.attachedListeners.set(type, []);
        }
        return this.attachedListeners.get(type);
    };
    /**
     * Adds the given event listener to the node.
     *
     * @param node The node to remove the event listener from
     * @param type The event to listen to
     * @param listener The listener to remove
     * @param options The event listener options
     */
    NodeEventSubscriber.prototype.on = function (node, type, listener, options) {
        node.addEventListener(type, listener, options);
        this.getEventListenersOfType(type).push([node, listener, options]);
    };
    /**
     * Removes the given event listener from the node.
     *
     * @param node The node to attach the event listener to
     * @param type The event to listen to
     * @param listener The listener to add
     * @param options The event listener options
     */
    NodeEventSubscriber.prototype.off = function (node, type, listener, options) {
        var listenersOfType = this.getEventListenersOfType(type);
        var listenerIndex = listenersOfType.findIndex(function (_a) {
            var otherNode = _a[0], otherListener = _a[1], otherOptions = _a[2];
            return otherNode === node && otherListener === listener && otherOptions === options;
        });
        node.removeEventListener(type, listener, options);
        if (listenerIndex > -1) {
            listenersOfType.splice(listenerIndex, 1);
        }
    };
    /**
     * Removes all attached event listeners.
     */
    NodeEventSubscriber.prototype.release = function () {
        var _this = this;
        this.attachedListeners.forEach(function (listenersOfType, type) {
            listenersOfType.forEach(function (_a) {
                var element = _a[0], listener = _a[1], options = _a[2];
                _this.off(element, type, listener, options);
            });
        });
        this.attachedListeners.clear();
    };
    return NodeEventSubscriber;
}());
exports.NodeEventSubscriber = NodeEventSubscriber;
