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
exports.PlaybackToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles between playback and pause.
 *
 * @category Buttons
 */
var PlaybackToggleButton = /** @class */ (function (_super) {
    __extends(PlaybackToggleButton, _super);
    function PlaybackToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktogglebutton',
            text: i18n_1.i18n.getLocalizer('play'),
            onAriaLabel: i18n_1.i18n.getLocalizer('pause'),
            offAriaLabel: i18n_1.i18n.getLocalizer('play'),
        }, _this.config);
        _this.isPlayInitiated = false;
        return _this;
    }
    PlaybackToggleButton.prototype.configure = function (player, uimanager, handleClickEvent) {
        var _this = this;
        if (handleClickEvent === void 0) { handleClickEvent = true; }
        _super.prototype.configure.call(this, player, uimanager);
        // Set enterFullscreenOnInitialPlayback if set in the uimanager config
        if (typeof uimanager.getConfig().enterFullscreenOnInitialPlayback === 'boolean') {
            this.config.enterFullscreenOnInitialPlayback = uimanager.getConfig().enterFullscreenOnInitialPlayback;
        }
        var isSeeking = false;
        var firstPlay = true;
        // Handler to update button state based on player state
        var playbackStateHandler = function () {
            // If the UI is currently seeking, playback is temporarily stopped but the buttons should
            // not reflect that and stay as-is (e.g indicate playback while seeking).
            if (isSeeking) {
                return;
            }
            if (player.isPlaying() || _this.isPlayInitiated) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        // Call handler upon these events
        player.on(player.exports.PlayerEvent.Play, function (e) {
            _this.isPlayInitiated = true;
            firstPlay = false;
            playbackStateHandler();
        });
        player.on(player.exports.PlayerEvent.Paused, function (e) {
            _this.isPlayInitiated = false;
            playbackStateHandler();
        });
        player.on(player.exports.PlayerEvent.Playing, function (e) {
            _this.isPlayInitiated = false;
            playbackStateHandler();
        });
        // after unloading + loading a new source, the player might be in a different playing state (from playing into stopped)
        player.on(player.exports.PlayerEvent.SourceLoaded, playbackStateHandler);
        uimanager.getConfig().events.onUpdated.subscribe(playbackStateHandler);
        player.on(player.exports.PlayerEvent.SourceUnloaded, playbackStateHandler);
        // when playback finishes, player turns to paused mode
        player.on(player.exports.PlayerEvent.PlaybackFinished, playbackStateHandler);
        player.on(player.exports.PlayerEvent.CastStarted, playbackStateHandler);
        // When a playback attempt is rejected with warning 5008, we switch the button state back to off
        // This is required for blocked autoplay, because there is no Paused event in such case
        player.on(player.exports.PlayerEvent.Warning, function (event) {
            if (event.code === player.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED) {
                _this.isPlayInitiated = false;
                firstPlay = true;
                _this.off();
            }
        });
        var updateLiveState = function () {
            var showStopToggle = player.isLive() && !PlayerUtils_1.PlayerUtils.isTimeShiftAvailable(player);
            if (showStopToggle) {
                _this.getDomElement().addClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
            else {
                _this.getDomElement().removeClass(_this.prefixCss(PlaybackToggleButton.CLASS_STOPTOGGLE));
            }
        };
        // Detect absence of timeshifting on live streams and add tagging class to convert button icons to play/stop
        var timeShiftDetector = new PlayerUtils_1.PlayerUtils.TimeShiftAvailabilityDetector(player);
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(function () { return updateLiveState(); });
        liveStreamDetector.onLiveChanged.subscribe(function () { return updateLiveState(); });
        timeShiftDetector.detect(); // Initial detection
        liveStreamDetector.detect();
        if (handleClickEvent) {
            // Control player by button events
            // When a button event triggers a player API call, events are fired which in turn call the event handler
            // above that updated the button state.
            this.onClick.subscribe(function () {
                if (player.isPlaying() || _this.isPlayInitiated) {
                    player.pause('ui');
                }
                else {
                    player.play('ui');
                    if (firstPlay && _this.config.enterFullscreenOnInitialPlayback) {
                        player.setViewMode(player.exports.ViewMode.Fullscreen);
                    }
                }
            });
        }
        // Track UI seeking status
        uimanager.onSeek.subscribe(function () {
            isSeeking = true;
        });
        uimanager.onSeeked.subscribe(function () {
            isSeeking = false;
        });
        // Startup init
        playbackStateHandler();
    };
    PlaybackToggleButton.CLASS_STOPTOGGLE = 'stoptoggle';
    return PlaybackToggleButton;
}(ToggleButton_1.ToggleButton));
exports.PlaybackToggleButton = PlaybackToggleButton;
