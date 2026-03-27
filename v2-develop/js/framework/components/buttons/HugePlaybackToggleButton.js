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
exports.HugePlaybackToggleButton = void 0;
var PlaybackToggleButton_1 = require("./PlaybackToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that overlays the video and toggles between playback and pause.
 *
 * @category Buttons
 */
var HugePlaybackToggleButton = /** @class */ (function (_super) {
    __extends(HugePlaybackToggleButton, _super);
    function HugePlaybackToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-hugeplaybacktogglebutton',
            text: i18n_1.i18n.getLocalizer('playPause'),
            role: 'button',
        }, _this.config);
        return _this;
    }
    HugePlaybackToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        // Update button state through API events
        _super.prototype.configure.call(this, player, uimanager, false);
        // Set enterFullscreenOnInitialPlayback if set in the uimanager config
        if (typeof uimanager.getConfig().enterFullscreenOnInitialPlayback === 'boolean') {
            this.config.enterFullscreenOnInitialPlayback = uimanager.getConfig().enterFullscreenOnInitialPlayback;
        }
        var togglePlayback = function () {
            if (player.isPlaying() || _this.isPlayInitiated) {
                player.pause('ui');
            }
            else {
                player.play('ui');
            }
        };
        var toggleFullscreen = function () {
            if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
                player.setViewMode(player.exports.ViewMode.Inline);
            }
            else {
                player.setViewMode(player.exports.ViewMode.Fullscreen);
            }
        };
        var firstPlay = true;
        var clickTime = 0;
        var doubleClickTime = 0;
        /*
         * YouTube-style toggle button handling
         *
         * The goal is to prevent a short pause or playback interval between a click, that toggles playback, and a
         * double click, that toggles fullscreen. In this naive approach, the first click would e.g. start playback,
         * the second click would be detected as double click and toggle to fullscreen, and as second normal click stop
         * playback, which results is a short playback interval with max length of the double click detection
         * period (usually 500ms).
         *
         * To solve this issue, we defer handling of the first click for 200ms, which is almost unnoticeable to the user,
         * and just toggle playback if no second click (double click) has been registered during this period. If a double
         * click is registered, we just toggle the fullscreen. In the first 200ms, undesired playback changes thus cannot
         * happen. If a double click is registered within 500ms, we undo the playback change and switch fullscreen mode.
         * In the end, this method basically introduces a 200ms observing interval in which playback changes are prevented
         * if a double click happens.
         */
        this.onClick.subscribe(function () {
            // Directly start playback on first click of the button.
            // This is a required workaround for mobile browsers where video playback needs to be triggered directly
            // by the user. A deferred playback start through the timeout below is not considered as user action and
            // therefore ignored by mobile browsers.
            if (firstPlay) {
                // Try to start playback. Then we wait for Play and only when it arrives, we disable the firstPlay flag.
                // If we disable the flag here, onClick was triggered programmatically instead of by a user interaction, and
                // playback is blocked (e.g. on mobile devices due to the programmatic play() call), we loose the chance to
                // ever start playback through a user interaction again with this button.
                togglePlayback();
                if (_this.config.enterFullscreenOnInitialPlayback) {
                    player.setViewMode(player.exports.ViewMode.Fullscreen);
                }
                return;
            }
            var now = Date.now();
            if (now - clickTime < 200) {
                // We have a double click inside the 200ms interval, just toggle fullscreen mode
                toggleFullscreen();
                doubleClickTime = now;
                return;
            }
            else if (now - clickTime < 500) {
                // We have a double click inside the 500ms interval, undo playback toggle and toggle fullscreen mode
                toggleFullscreen();
                togglePlayback();
                doubleClickTime = now;
                return;
            }
            clickTime = now;
            setTimeout(function () {
                if (Date.now() - doubleClickTime > 200) {
                    // No double click detected, so we toggle playback and wait what happens next
                    togglePlayback();
                }
            }, 200);
        });
        player.on(player.exports.PlayerEvent.Play, function () {
            // Playback has really started, we can disable the flag to switch to normal toggle button handling
            firstPlay = false;
        });
        player.on(player.exports.PlayerEvent.Warning, function (event) {
            if (event.code === player.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED) {
                // if playback could not be started, reset the first play flag as we need the user interaction to start
                firstPlay = true;
            }
        });
        var suppressPlayButtonTransitionAnimation = function () {
            // Disable the current animation
            _this.setTransitionAnimationsEnabled(false);
            // Enable the transition animations for the next state change
            _this.onToggle.subscribeOnce(function () {
                _this.setTransitionAnimationsEnabled(true);
            });
        };
        // Hide the play button animation when the UI is loaded (it should only be animated on state changes)
        suppressPlayButtonTransitionAnimation();
        var isAutoplayEnabled = player.getConfig().playback && Boolean(player.getConfig().playback.autoplay);
        // We only know if an autoplay attempt is upcoming if the player is not yet ready. It the player is already ready,
        // the attempt might be upcoming or might have already happened, but we don't have to handle that because we can
        // simply rely on isPlaying and the play state events.
        var isAutoplayUpcoming = !player.getSource() && isAutoplayEnabled;
        // Hide the play button when the player is already playing or autoplay is upcoming
        if (player.isPlaying() || isAutoplayUpcoming) {
            // Hide the play button (switch to playing state)
            this.on();
            // Disable the animation of the playing state switch
            suppressPlayButtonTransitionAnimation();
            // Show the play button without an animation if a play attempt is blocked
            player.on(player.exports.PlayerEvent.Warning, function (event) {
                if (event.code === player.exports.WarningCode.PLAYBACK_COULD_NOT_BE_STARTED) {
                    suppressPlayButtonTransitionAnimation();
                }
            });
        }
    };
    /**
     * Enables or disables the play state transition animations of the play button image. Can be used to suppress
     * animations.
     * @param {boolean} enabled true to enable the animations (default), false to disable them
     */
    HugePlaybackToggleButton.prototype.setTransitionAnimationsEnabled = function (enabled) {
        var noTransitionAnimationsClass = this.prefixCss('no-transition-animations');
        if (enabled) {
            this.getDomElement().removeClass(noTransitionAnimationsClass);
        }
        else if (!this.getDomElement().hasClass(noTransitionAnimationsClass)) {
            this.getDomElement().addClass(noTransitionAnimationsClass);
        }
    };
    return HugePlaybackToggleButton;
}(PlaybackToggleButton_1.PlaybackToggleButton));
exports.HugePlaybackToggleButton = HugePlaybackToggleButton;
