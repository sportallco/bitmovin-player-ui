"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekBarHandler = void 0;
var NodeEventSubscriber_1 = require("./NodeEventSubscriber");
var types_1 = require("./types");
var NavigationAlgorithm_1 = require("./NavigationAlgorithm");
var toHtmlElement_1 = require("./helper/toHtmlElement");
var DefaultScrubSpeedPercentage = 0.005;
var ScrubSpeedClearInterval = 100;
var ScrubSpeedMultiplier = 1.1;
/**
 * Handles Spatial Navigation interaction with the seek bar. Ensures, that seek operations can be executed and that the
 * scrubbing tooltip is shown as if the user scrubbed using the mouse/touchscreen.
 */
var SeekBarHandler = /** @class */ (function () {
    function SeekBarHandler(rootNavigationGroup) {
        var _this = this;
        this.rootNavigationGroup = rootNavigationGroup;
        this.cursorPosition = { x: 0, y: 0 };
        this.isScrubbing = false;
        this.scrubSpeedPercentage = DefaultScrubSpeedPercentage;
        this.onNavigation = function (direction, target, preventDefault) {
            var element = (0, toHtmlElement_1.toHtmlElement)(target);
            if (!isSeekBarWrapper(element)) {
                return false;
            }
            if (direction === types_1.Direction.UP || direction === types_1.Direction.DOWN) {
                _this.stopSeeking(getSeekBar(element));
                return true;
            }
            _this.initializeOrUpdateCursorPosition(element, direction);
            _this.dispatchMouseMoveEvent(getSeekBar(element));
            preventDefault();
            return true;
        };
        this.onAction = function (action, target, preventDefault) {
            var element = (0, toHtmlElement_1.toHtmlElement)(target);
            if (!isSeekBarWrapper(element)) {
                return false;
            }
            var seekBar = getSeekBar(element);
            if (action === types_1.Action.SELECT && _this.isScrubbing) {
                _this.dispatchMouseClickEvent(seekBar);
                preventDefault();
                return true;
            }
            else if (action === types_1.Action.BACK && _this.isScrubbing) {
                _this.stopSeeking(seekBar);
                preventDefault();
                return true;
            }
            return false;
        };
        this.rootNavigationGroup.onAction = this.onAction;
        this.eventSubscriber = new NodeEventSubscriber_1.NodeEventSubscriber();
        this.rootNavigationGroup.onNavigation = this.onNavigation;
    }
    SeekBarHandler.prototype.updateScrubSpeedPercentage = function () {
        var _this = this;
        clearTimeout(this.scrubSpeedResetTimeout);
        this.scrubSpeedPercentage *= ScrubSpeedMultiplier;
        this.scrubSpeedResetTimeout = window.setTimeout(function () { return (_this.scrubSpeedPercentage = DefaultScrubSpeedPercentage); }, ScrubSpeedClearInterval);
    };
    SeekBarHandler.prototype.getIncrement = function (direction, seekBarWidth) {
        this.updateScrubSpeedPercentage();
        var increment = seekBarWidth * this.scrubSpeedPercentage;
        return direction === types_1.Direction.RIGHT ? increment : -increment;
    };
    SeekBarHandler.prototype.resetCursorPosition = function () {
        this.cursorPosition.x = 0;
        this.cursorPosition.y = 0;
    };
    SeekBarHandler.prototype.updateCursorPosition = function (direction, seekBarWrapper) {
        // Read the layout once and reuse it for both the increment and the clamp bounds, to avoid two
        // getBoundingClientRect() reflows per navigation while scrubbing on low-powered TV devices.
        // Use getBoundingRectFromElement (not getBoundingClientRect directly) so that `x` is also
        // populated on older TV browsers that only return `left`/`top` - same as initializeCursorPosition.
        var rect = (0, NavigationAlgorithm_1.getBoundingRectFromElement)(seekBarWrapper);
        var increment = this.getIncrement(direction, rect.width);
        var minX = rect.x;
        var maxX = rect.x + rect.width;
        // Clamp the cursor position to the seek bar bounds. Without this, holding the remote in one
        // direction past the start/end keeps moving the (invisible) cursor beyond the seek bar, and the
        // user then has to "unwind" all that overshoot before scrubbing back the other way has any effect.
        this.cursorPosition.x = Math.min(Math.max(this.cursorPosition.x + increment, minX), maxX);
    };
    SeekBarHandler.prototype.initializeCursorPosition = function (seekBarWrapper) {
        var playbackPositionMarker = getPlaybackPositionMarker(seekBarWrapper);
        var rect = (0, NavigationAlgorithm_1.getBoundingRectFromElement)(playbackPositionMarker);
        var startX = rect.x + rect.width / 2;
        var startY = rect.y;
        this.cursorPosition.x = startX;
        this.cursorPosition.y = startY;
    };
    SeekBarHandler.prototype.initializeOrUpdateCursorPosition = function (seekBarWrapper, direction) {
        if (this.isScrubbing) {
            this.updateCursorPosition(direction, seekBarWrapper);
        }
        else {
            this.initializeCursorPosition(seekBarWrapper);
        }
        this.isScrubbing = true;
    };
    SeekBarHandler.prototype.getCursorPositionMouseEventInit = function () {
        return {
            clientX: this.cursorPosition.x,
            clientY: this.cursorPosition.y,
        };
    };
    SeekBarHandler.prototype.dispatchMouseMoveEvent = function (seekBar) {
        seekBar.dispatchEvent(new MouseEvent('mousemove', this.getCursorPositionMouseEventInit()));
    };
    SeekBarHandler.prototype.dispatchMouseClickEvent = function (seekBar) {
        var _this = this;
        var mouseDownHandler = function () {
            var mouseEventInit = _this.getCursorPositionMouseEventInit();
            document.dispatchEvent(new MouseEvent('mouseup', mouseEventInit));
            _this.eventSubscriber.off(seekBar, 'mousedown', mouseDownHandler);
            _this.stopSeeking(seekBar);
        };
        this.eventSubscriber.on(seekBar, 'mousedown', mouseDownHandler);
        seekBar.dispatchEvent(new MouseEvent('mousedown'));
    };
    SeekBarHandler.prototype.stopSeeking = function (seekBar) {
        this.resetCursorPosition();
        this.isScrubbing = false;
        this.dispatchMouseLeaveEvent(seekBar);
    };
    SeekBarHandler.prototype.dispatchMouseLeaveEvent = function (seekBar) {
        seekBar.dispatchEvent(new MouseEvent('mouseleave'));
    };
    /**
     * Releases the SeekBraHandler, making sure all event subscribers are removed.
     */
    SeekBarHandler.prototype.release = function () {
        this.eventSubscriber.release();
        this.rootNavigationGroup.onAction = undefined;
        this.rootNavigationGroup.onNavigation = undefined;
    };
    return SeekBarHandler;
}());
exports.SeekBarHandler = SeekBarHandler;
function isSeekBarWrapper(element) {
    return Array.from(element.classList).findIndex(function (className) { return /-ui-seekbar$/.test(className); }) > -1;
}
function getSeekBar(seekBarWrapper) {
    return seekBarWrapper.children.item(0);
}
function getPlaybackPositionMarker(seekBarWrapper) {
    return seekBarWrapper.querySelector('[class*="seekbar-playbackposition-marker"]');
}
