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
exports.SmallCenteredPlaybackToggleButton = void 0;
var PlaybackToggleButton_1 = require("./PlaybackToggleButton");
var i18n_1 = require("../../localization/i18n");
var SmallCenteredPlaybackToggleButton = /** @class */ (function (_super) {
    __extends(SmallCenteredPlaybackToggleButton, _super);
    function SmallCenteredPlaybackToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-smallcenteredplaybacktogglebutton',
            text: i18n_1.i18n.getLocalizer('playPause'),
            role: 'button',
        }, _this.config);
        return _this;
    }
    SmallCenteredPlaybackToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        var _a;
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
        var firstPlay = true;
        this.onClick.subscribe(function () {
            togglePlayback();
            if (firstPlay && _this.config.enterFullscreenOnInitialPlayback) {
                player.setViewMode(player.exports.ViewMode.Fullscreen);
            }
        });
        player.on(player.exports.PlayerEvent.Playing, function () {
            // Playback has really started, we can disable the flag to switch to normal toggle button handling
            firstPlay = false;
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
        var isAutoplayEnabled = Boolean((_a = player.getConfig().playback) === null || _a === void 0 ? void 0 : _a.autoplay);
        // We only know if an autoplay attempt is upcoming if the player is not yet ready. If the player is already ready,
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
    SmallCenteredPlaybackToggleButton.prototype.setTransitionAnimationsEnabled = function (enabled) {
        var noTransitionAnimationsClass = this.prefixCss('no-transition-animations');
        if (enabled) {
            this.getDomElement().removeClass(noTransitionAnimationsClass);
        }
        else if (!this.getDomElement().hasClass(noTransitionAnimationsClass)) {
            this.getDomElement().addClass(noTransitionAnimationsClass);
        }
    };
    return SmallCenteredPlaybackToggleButton;
}(PlaybackToggleButton_1.PlaybackToggleButton));
exports.SmallCenteredPlaybackToggleButton = SmallCenteredPlaybackToggleButton;
