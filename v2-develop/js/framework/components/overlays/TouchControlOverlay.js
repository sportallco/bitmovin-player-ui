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
exports.TouchControlOverlay = void 0;
var Container_1 = require("../Container");
var SmallCenteredPlaybackToggleButton_1 = require("../buttons/SmallCenteredPlaybackToggleButton");
var EventDispatcher_1 = require("../../EventDispatcher");
var Timeout_1 = require("../../utils/Timeout");
var Label_1 = require("../labels/Label");
var i18n_1 = require("../../localization/i18n");
/**
 * Overlays the player and detects touch input
 */
var TouchControlOverlay = /** @class */ (function (_super) {
    __extends(TouchControlOverlay, _super);
    function TouchControlOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.SEEK_FORWARD_CLASS = 'seek-forward';
        _this.SEEK_BACKWARD_CLASS = 'seek-backward';
        _this.touchControlEvents = {
            onSingleClick: new EventDispatcher_1.EventDispatcher(),
            onDoubleClick: new EventDispatcher_1.EventDispatcher(),
            onSeekBackward: new EventDispatcher_1.EventDispatcher(),
            onSeekForward: new EventDispatcher_1.EventDispatcher(),
        };
        _this.playbackToggleButton = new SmallCenteredPlaybackToggleButton_1.SmallCenteredPlaybackToggleButton({
            enterFullscreenOnInitialPlayback: Boolean(config.enterFullscreenOnInitialPlayback),
        });
        _this.seekForwardLabel = new Label_1.Label({
            text: '',
            for: _this.getConfig().id,
            cssClass: 'seek-forward-label',
            hidden: true,
        });
        _this.seekBackwardLabel = new Label_1.Label({
            text: '',
            for: _this.getConfig().id,
            cssClass: 'seek-backward-label',
            hidden: true,
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-touch-control-overlay',
            acceptsTouchWithUiHidden: true,
            seekTime: 10,
            seekDoubleTapMargin: 15,
            seekDoubleTapTimeout: 200,
            components: [_this.seekBackwardLabel, _this.playbackToggleButton, _this.seekForwardLabel],
        }, _this.config);
        return _this;
    }
    TouchControlOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var playerSeekTime = 0;
        var startSeekTime = 0;
        this.doubleTapTimeout = new Timeout_1.Timeout(this.config.seekDoubleTapTimeout, function () {
            _this.couldBeDoubleTapping = false;
            startSeekTime = 0;
            setTimeout(function () { return _this.hideSeekAnimationElements(); }, 150);
        });
        var isBufferingOverlayVisible = false;
        var areControlsVisible = false;
        var showPlaybackToggleButton = function () {
            _this.playbackToggleButton.show();
        };
        var hidePlaybackToggleButton = function () {
            _this.playbackToggleButton.hide();
        };
        uimanager.onBufferingShow.subscribe(function () {
            isBufferingOverlayVisible = true;
            hidePlaybackToggleButton();
        });
        uimanager.onBufferingHide.subscribe(function () {
            isBufferingOverlayVisible = false;
            if (areControlsVisible) {
                showPlaybackToggleButton();
            }
        });
        uimanager.onControlsHide.subscribe(function () {
            areControlsVisible = false;
            hidePlaybackToggleButton();
        });
        uimanager.onControlsShow.subscribe(function () {
            areControlsVisible = true;
            if (!isBufferingOverlayVisible) {
                showPlaybackToggleButton();
            }
        });
        this.touchControlEvents.onSeekBackward.subscribe(function () {
            playerSeekTime -= _this.config.seekTime;
            player.seek(playerSeekTime);
            _this.seekBackwardLabel.setText(Math.abs(Math.round(playerSeekTime - startSeekTime)) +
                ' ' +
                i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('settings.time.seconds')));
            _this.seekBackwardLabel.show();
            _this.getDomElement().addClass(_this.prefixCss(_this.SEEK_BACKWARD_CLASS));
            _this.seekForwardLabel.hide();
            _this.getDomElement().removeClass(_this.prefixCss(_this.SEEK_FORWARD_CLASS));
        });
        this.touchControlEvents.onSeekForward.subscribe(function () {
            playerSeekTime += _this.config.seekTime;
            player.seek(playerSeekTime);
            _this.seekForwardLabel.setText(Math.abs(Math.round(playerSeekTime - startSeekTime)) +
                ' ' +
                i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('settings.time.seconds')));
            _this.seekForwardLabel.show();
            _this.getDomElement().addClass(_this.prefixCss(_this.SEEK_FORWARD_CLASS));
            _this.seekBackwardLabel.hide();
            _this.getDomElement().removeClass(_this.prefixCss(_this.SEEK_BACKWARD_CLASS));
        });
        this.touchControlEvents.onSingleClick.subscribe(function (_, e) {
            uimanager.getUI().toggleUiShown();
            playerSeekTime = player.getCurrentTime();
            startSeekTime = playerSeekTime;
            var eventTarget = e.target;
            var rect = eventTarget.getBoundingClientRect();
            var eventTapX = e.clientX - rect.left;
            var eventTapY = e.clientY - rect.top;
            _this.latestTapPosition = { x: eventTapX, y: eventTapY };
        });
        this.touchControlEvents.onDoubleClick.subscribe(function (_, e) {
            uimanager.getUI().hideUi();
            var event = e;
            var eventTarget = event.target;
            if (!eventTarget || !(eventTarget.component instanceof TouchControlOverlay)) {
                return;
            }
            var width = eventTarget.clientWidth;
            var tapMargin = width * 0.4;
            var rect = eventTarget.getBoundingClientRect();
            var eventTapX = e.clientX - rect.left;
            var eventTapY = e.clientY - rect.top;
            var doubleTapMargin = _this.config.seekDoubleTapMargin;
            if (Math.abs(_this.latestTapPosition.x - eventTapX) <= doubleTapMargin &&
                Math.abs(_this.latestTapPosition.y - eventTapY) <= doubleTapMargin)
                if (eventTapX < tapMargin) {
                    _this.touchControlEvents.onSeekBackward.dispatch(_this);
                }
                else if (eventTapX > width - tapMargin) {
                    _this.touchControlEvents.onSeekForward.dispatch(_this);
                }
            _this.latestTapPosition = { x: eventTapX, y: eventTapY };
        });
        this.getDomElement().on('click', function (e) {
            if (e.target.component instanceof TouchControlOverlay) {
                clickEventDispatcher(e);
            }
        });
        var clickEventDispatcher = function (e) {
            if (_this.couldBeDoubleTapping) {
                _this.onDoubleClickEvent(e);
            }
            else {
                _this.onSingleClickEvent(e);
            }
            _this.couldBeDoubleTapping = true;
            _this.doubleTapTimeout.start();
        };
    };
    TouchControlOverlay.prototype.hideSeekAnimationElements = function () {
        this.getDomElement().removeClass(this.prefixCss(this.SEEK_FORWARD_CLASS));
        this.getDomElement().removeClass(this.prefixCss(this.SEEK_BACKWARD_CLASS));
        this.seekForwardLabel.hide();
        this.seekBackwardLabel.hide();
    };
    TouchControlOverlay.prototype.onDoubleClickEvent = function (e) {
        this.touchControlEvents.onDoubleClick.dispatch(this, e);
    };
    TouchControlOverlay.prototype.onSingleClickEvent = function (e) {
        this.touchControlEvents.onSingleClick.dispatch(this, e);
    };
    Object.defineProperty(TouchControlOverlay.prototype, "onClick", {
        get: function () {
            return this.touchControlEvents.onSingleClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return TouchControlOverlay;
}(Container_1.Container));
exports.TouchControlOverlay = TouchControlOverlay;
