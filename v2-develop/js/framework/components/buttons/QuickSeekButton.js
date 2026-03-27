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
exports.QuickSeekButton = void 0;
var Button_1 = require("./Button");
var i18n_1 = require("../../localization/i18n");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
/**
 * @category Buttons
 */
var QuickSeekButton = /** @class */ (function (_super) {
    __extends(QuickSeekButton, _super);
    function QuickSeekButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.onSeek = function (event) {
            _this.currentSeekTarget = event.seekTarget;
        };
        _this.onSeekedOrTimeShifted = function () {
            _this.currentSeekTarget = null;
        };
        _this.onTimeShift = function (event) {
            _this.currentSeekTarget = _this.player.getTimeShift() + (event.target - event.position);
        };
        _this.currentSeekTarget = null;
        _this.config = _this.mergeConfig(config, {
            seekSeconds: -10,
            cssClass: 'ui-quickseekbutton',
        }, _this.config);
        var seekDirection = _this.config.seekSeconds < 0 ? 'rewind' : 'forward';
        _this.config.text = _this.config.text || i18n_1.i18n.getLocalizer("quickseek.".concat(seekDirection));
        _this.config.ariaLabel =
            _this.config.ariaLabel ||
                i18n_1.i18n.getLocalizer("quickseek.".concat(seekDirection), {
                    seekSeconds: Math.abs(_this.config.seekSeconds),
                });
        _this.getDomElement()
            .data(_this.prefixCss('seek-direction'), seekDirection)
            .data(_this.prefixCss('seek-seconds'), Math.abs(_this.config.seekSeconds).toString());
        return _this;
    }
    QuickSeekButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        var isLive;
        var hasTimeShift;
        var switchVisibility = function (isLive, hasTimeShift) {
            if (isLive && !hasTimeShift) {
                _this.hide();
            }
            else {
                _this.show();
            }
        };
        var timeShiftDetector = new PlayerUtils_1.PlayerUtils.TimeShiftAvailabilityDetector(player);
        timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            hasTimeShift = args.timeShiftAvailable;
            switchVisibility(isLive, hasTimeShift);
        });
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            isLive = args.live;
            switchVisibility(isLive, hasTimeShift);
        });
        // Initial detection
        timeShiftDetector.detect();
        liveStreamDetector.detect();
        this.onClick.subscribe(function () {
            if (isLive && !hasTimeShift) {
                // If no DVR window is available, the button should be hidden anyway, so this is to be absolutely sure
                return;
            }
            if (isLive && _this.config.seekSeconds > 0 && player.getTimeShift() === 0) {
                // Don't do anything if the player is already on the live edge
                return;
            }
            var currentPosition = _this.currentSeekTarget !== null
                ? _this.currentSeekTarget
                : isLive
                    ? player.getTimeShift()
                    : player.getCurrentTime();
            var newSeekTime = currentPosition + _this.config.seekSeconds;
            if (isLive) {
                var clampedValue = PlayerUtils_1.PlayerUtils.clampValueToRange(newSeekTime, player.getMaxTimeShift(), 0);
                player.timeShift(clampedValue);
            }
            else {
                var clampedValue = PlayerUtils_1.PlayerUtils.clampValueToRange(newSeekTime, 0, player.getDuration());
                player.seek(clampedValue);
            }
        });
        this.player.on(this.player.exports.PlayerEvent.Seek, this.onSeek);
        this.player.on(this.player.exports.PlayerEvent.Seeked, this.onSeekedOrTimeShifted);
        this.player.on(this.player.exports.PlayerEvent.TimeShift, this.onTimeShift);
        this.player.on(this.player.exports.PlayerEvent.TimeShifted, this.onSeekedOrTimeShifted);
    };
    QuickSeekButton.prototype.release = function () {
        this.player.off(this.player.exports.PlayerEvent.Seek, this.onSeek);
        this.player.off(this.player.exports.PlayerEvent.Seeked, this.onSeekedOrTimeShifted);
        this.player.off(this.player.exports.PlayerEvent.TimeShift, this.onTimeShift);
        this.player.off(this.player.exports.PlayerEvent.TimeShifted, this.onSeekedOrTimeShifted);
        this.currentSeekTarget = null;
        this.player = null;
    };
    return QuickSeekButton;
}(Button_1.Button));
exports.QuickSeekButton = QuickSeekButton;
