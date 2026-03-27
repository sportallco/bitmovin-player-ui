"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpatialNavigation = void 0;
var NodeEventSubscriber_1 = require("./NodeEventSubscriber");
var SeekBarHandler_1 = require("./SeekBarHandler");
var getKeyMapForPlatform_1 = require("./getKeyMapForPlatform");
var TypeGuards_1 = require("./TypeGuards");
/**
 * SpatialNavigation keeps track of all navigation groups, and updates the active navigation group when visibility
 * changes on group container.
 *
 * It listens to key events, and triggers either handleNavigation or handleAction on the active group.
 * SeekBarHandler will get instantiated with root navigation group and disposed on release of the spatial navigation.
 */
var SpatialNavigation = /** @class */ (function () {
    function SpatialNavigation(rootNavigationGroup) {
        var navigationGroups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            navigationGroups[_i - 1] = arguments[_i];
        }
        var _this = this;
        this.navigationGroups = [];
        this.onShow = function (group) {
            _this.activeNavigationGroups.push(group);
            _this.updateEnabledNavigationGroup();
        };
        this.onHide = function (group) {
            var groupIndex = _this.activeNavigationGroups.findIndex(function (other) { return other === group; });
            if (groupIndex > -1) {
                group.disable();
                _this.activeNavigationGroups.splice(groupIndex, 1);
                _this.updateEnabledNavigationGroup();
            }
        };
        /**
         * Checks if keyboard event keycode is tracked either as Direction or Action and calls appropriate handler on active
         * navigation group
         *
         * @param e {KeyboardEvent}
         */
        this.handleKeyEvent = function (e) {
            var event = _this.keyMap[getKeyCode(e)];
            var active = _this.getActiveNavigationGroup();
            if (!active || !active.container || active.container.isHidden() || active.container.isDisabled()) {
                return;
            }
            if ((0, TypeGuards_1.isDirection)(event)) {
                active.handleNavigation(event);
                e.preventDefault();
                e.stopPropagation();
            }
            if ((0, TypeGuards_1.isAction)(event)) {
                active.handleAction(event);
                e.preventDefault();
                e.stopPropagation();
            }
        };
        this.seekBarHandler = new SeekBarHandler_1.SeekBarHandler(rootNavigationGroup);
        this.activeNavigationGroups = [];
        this.unsubscribeVisibilityChangesFns = [];
        this.eventSubscriber = new NodeEventSubscriber_1.NodeEventSubscriber();
        this.navigationGroups = __spreadArray([rootNavigationGroup], navigationGroups, true);
        this.keyMap = (0, getKeyMapForPlatform_1.getKeyMapForPlatform)();
        this.subscribeToNavigationGroupVisibilityChanges();
        this.attachKeyEventHandler();
        this.enableDefaultNavigationGroup();
    }
    SpatialNavigation.prototype.attachKeyEventHandler = function () {
        this.eventSubscriber.on(document, 'keydown', this.handleKeyEvent, true);
    };
    /**
     * Subscribes to onHide and onShow on all navigation groups containers as Spatial navigation tracks active navigation
     * group based on their container visibility.
     */
    SpatialNavigation.prototype.subscribeToNavigationGroupVisibilityChanges = function () {
        var _this = this;
        this.navigationGroups.forEach(function (group) {
            var onShowHandler = function () { return _this.onShow(group); };
            var onHideHandler = function () { return _this.onHide(group); };
            group.container.onShow.subscribe(onShowHandler);
            group.container.onHide.subscribe(onHideHandler);
            _this.unsubscribeVisibilityChangesFns.push(function () { return group.container.onShow.unsubscribe(onShowHandler); }, function () { return group.container.onHide.unsubscribe(onHideHandler); });
        });
    };
    SpatialNavigation.prototype.unsubscribeFromNavigationGroupVisibilityChanges = function () {
        this.unsubscribeVisibilityChangesFns.forEach(function (unsub) { return unsub(); });
        this.unsubscribeVisibilityChangesFns = [];
    };
    /**
     * It will enable group of which container is currently shown
     * If there are no groups with containers that are currently visible, it will enable root navigation group
     */
    SpatialNavigation.prototype.enableDefaultNavigationGroup = function () {
        var _a;
        var isShown = function (group) { return group.container.isShown(); };
        var groupToEnable = (_a = this.navigationGroups.find(isShown)) !== null && _a !== void 0 ? _a : this.navigationGroups[0];
        if (groupToEnable) {
            this.activeNavigationGroups.push(groupToEnable);
            this.updateEnabledNavigationGroup();
        }
    };
    /**
     * Disables navigation groups that are no longer active and calls enable on last pushed navigation group
     */
    SpatialNavigation.prototype.updateEnabledNavigationGroup = function () {
        var _this = this;
        this.activeNavigationGroups.forEach(function (group, idx) {
            if (idx < _this.activeNavigationGroups.length - 1) {
                group.disable();
            }
            else {
                group.enable();
            }
        });
    };
    /**
     * Returns currently active navigation group
     */
    SpatialNavigation.prototype.getActiveNavigationGroup = function () {
        return this.activeNavigationGroups[this.activeNavigationGroups.length - 1];
    };
    /**
     * Dispose of SpatialNavigation
     *
     * Remove all event handlers, release seekbar handler and release all navigation groups.
     */
    SpatialNavigation.prototype.release = function () {
        this.unsubscribeFromNavigationGroupVisibilityChanges();
        this.eventSubscriber.release();
        this.navigationGroups.forEach(function (group) { return group.release(); });
        this.seekBarHandler.release();
    };
    return SpatialNavigation;
}());
exports.SpatialNavigation = SpatialNavigation;
function getKeyCode(event) {
    return event.keyCode;
}
