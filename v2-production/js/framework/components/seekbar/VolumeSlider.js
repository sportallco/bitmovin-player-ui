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
exports.VolumeSlider = void 0;
var SeekBar_1 = require("./SeekBar");
var i18n_1 = require("../../localization/i18n");
var BrowserUtils_1 = require("../../utils/BrowserUtils");
/**
 * A simple volume slider component to adjust the player's volume setting.
 *
 * @category Components
 */
var VolumeSlider = /** @class */ (function (_super) {
    __extends(VolumeSlider, _super);
    function VolumeSlider(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.updateVolumeWhileScrubbing = function (sender, args) {
            if (args.scrubbing && _this.volumeTransition) {
                _this.volumeTransition.update(args.position);
            }
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-volumeslider',
            hideIfVolumeControlProhibited: true,
            hideOnMobile: true,
            ariaLabel: i18n_1.i18n.getLocalizer('settings.audio.volume'),
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    VolumeSlider.prototype.setVolumeAriaSliderValues = function (value) {
        this.getDomElement().attr('aria-valuenow', Math.ceil(value).toString());
        this.getDomElement().attr('aria-valuetext', "".concat(i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('seekBar.value')), ": ").concat(Math.ceil(value)));
    };
    VolumeSlider.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager, false);
        this.setAriaSliderMinMax('0', '100');
        var config = this.getConfig();
        var volumeController = uimanager.getConfig().volumeController;
        if ((config.hideOnMobile && BrowserUtils_1.BrowserUtils.isMobile) ||
            (config.hideIfVolumeControlProhibited && !this.detectVolumeControlAvailability())) {
            this.hide();
            // We can just return from here, because the user will never interact with the control and any configured
            // functionality would only eat resources for no reason.
            return;
        }
        volumeController.onChanged.subscribe(function (_, args) {
            if (args.muted) {
                _this.setVolumeAriaSliderValues(0);
                _this.setPlaybackPosition(0);
            }
            else {
                _this.setPlaybackPosition(args.volume);
                _this.setVolumeAriaSliderValues(args.volume);
            }
        });
        this.onSeek.subscribe(function () {
            _this.volumeTransition = volumeController.startTransition();
        });
        this.onSeekPreview.subscribeRateLimited(this.updateVolumeWhileScrubbing, 50);
        this.onSeeked.subscribe(function (sender, percentage) {
            if (_this.volumeTransition) {
                _this.volumeTransition.finish(percentage);
            }
        });
        // Update the volume slider marker when the player resized, a source is loaded,
        // or the UI is configured. Check the seekbar for a detailed description.
        player.on(player.exports.PlayerEvent.PlayerResized, function () {
            _this.refreshPlaybackPosition();
        });
        uimanager.onConfigured.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        uimanager.getConfig().events.onUpdated.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        uimanager.onComponentShow.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        uimanager.onComponentHide.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        // Init volume bar
        volumeController.onChangedEvent();
    };
    VolumeSlider.prototype.detectVolumeControlAvailability = function () {
        /*
         * "On iOS devices, the audio level is always under the user’s physical control. The volume property is not
         * settable in JavaScript. Reading the volume property always returns 1."
         * https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
         */
        // as muted autoplay gets paused as soon as we unmute it, we may not touch the volume of the actual player so we
        // probe a dummy audio element
        var dummyVideoElement = document.createElement('video');
        // try setting the volume to 0.7 and if it's still 1 we are on a volume control restricted device
        dummyVideoElement.volume = 0.7;
        return dummyVideoElement.volume !== 1;
    };
    VolumeSlider.prototype.release = function () {
        _super.prototype.release.call(this);
        this.onSeekPreview.unsubscribe(this.updateVolumeWhileScrubbing);
    };
    return VolumeSlider;
}(SeekBar_1.SeekBar));
exports.VolumeSlider = VolumeSlider;
