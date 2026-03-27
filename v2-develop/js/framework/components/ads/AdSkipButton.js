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
exports.AdSkipButton = void 0;
var Button_1 = require("../buttons/Button");
var StringUtils_1 = require("../../utils/StringUtils");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that is displayed during ads and can be used to skip the ad.
 *
 * @category Buttons
 */
var AdSkipButton = /** @class */ (function (_super) {
    __extends(AdSkipButton, _super);
    function AdSkipButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.skipOffset = -1;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button-ad-skip',
            untilSkippableMessage: i18n_1.i18n.getLocalizer('ads.skippableIn'),
            skippableMessage: i18n_1.i18n.getLocalizer('ads.skip'),
            acceptsTouchWithUiHidden: true,
            buttonStyle: Button_1.ButtonStyle.TextWithTrailingIcon,
        }, _this.config);
        return _this;
    }
    AdSkipButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        var config = this.getConfig();
        this.untilSkippableMessage = config.untilSkippableMessage;
        this.skippableMessage = config.skippableMessage;
        this.skipOffset = -1;
        this.updateSkipMessageHandler = function () {
            _this.show();
            // Update the skip message on the button
            if (player.getCurrentTime() < _this.skipOffset) {
                _this.setText(StringUtils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(_this.untilSkippableMessage), player, _this.skipOffset));
                _this.disable();
            }
            else {
                _this.setText(StringUtils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(_this.skippableMessage), player));
                _this.enable();
            }
        };
        var adStartHandler = function (event) {
            var ad = event.ad;
            _this.skipOffset = ad.skippableAfter;
            _this.untilSkippableMessage = (ad.uiConfig && ad.uiConfig.untilSkippableMessage) || config.untilSkippableMessage;
            _this.skippableMessage = (ad.uiConfig && ad.uiConfig.skippableMessage) || config.skippableMessage;
            // Display this button only if ad is skippable.
            // Non-skippable ads will return -1 for skippableAfter for player version < v8.3.0.
            if (typeof _this.skipOffset === 'number' && _this.skipOffset >= 0) {
                _this.updateSkipMessageHandler();
                player.on(player.exports.PlayerEvent.TimeChanged, _this.updateSkipMessageHandler);
            }
            else {
                _this.hide();
            }
        };
        var adEndHandler = function () {
            if (_this.updateSkipMessageHandler) {
                player.off(player.exports.PlayerEvent.TimeChanged, _this.updateSkipMessageHandler);
            }
        };
        player.on(player.exports.PlayerEvent.AdStarted, adStartHandler);
        player.on(player.exports.PlayerEvent.AdSkipped, adEndHandler);
        player.on(player.exports.PlayerEvent.AdError, adEndHandler);
        player.on(player.exports.PlayerEvent.AdFinished, adEndHandler);
        this.onClick.subscribe(function () {
            // Try to skip the ad (this only works if it is skippable so we don't need to take extra care of that here)
            player.ads.skip();
        });
    };
    AdSkipButton.prototype.onLanguageChanged = function () {
        if (this.updateSkipMessageHandler && typeof this.skipOffset === 'number' && this.skipOffset >= 0) {
            this.updateSkipMessageHandler();
        }
    };
    AdSkipButton.prototype.release = function () {
        if (this.player && this.updateSkipMessageHandler) {
            this.player.off(this.player.exports.PlayerEvent.TimeChanged, this.updateSkipMessageHandler);
        }
        _super.prototype.release.call(this);
    };
    return AdSkipButton;
}(Button_1.Button));
exports.AdSkipButton = AdSkipButton;
