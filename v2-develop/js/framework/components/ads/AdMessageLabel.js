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
exports.AdMessageLabel = void 0;
var Label_1 = require("../labels/Label");
var i18n_1 = require("../../localization/i18n");
var StringUtils_1 = require("../../utils/StringUtils");
/**
 * A label that displays a message about a running ad, optionally with a countdown.
 *
 * The message text supports placeholders that are dynamically replaced with ad timing information:
 * - `{remainingTime[formatString]}` - Remaining time until the ad ends
 * - `{playedTime[formatString]}` - Current playback time of the ad
 * - `{adDuration[formatString]}` - Total duration of the current ad
 * - `{adBreakRemainingTime[formatString]}` - Remaining time for the entire ad break (including all remaining ads)
 *
 * Format string options (optional):
 * - `%d` - Integer (e.g., `{remainingTime%d}` → `100`)
 * - `%0Nd` - Integer with N leading zeros (e.g., `{remainingTime%03d}` → `100`)
 * - `%f` - Float (e.g., `{remainingTime%f}` → `100.0`)
 * - `%0Nf` - Float with leading zeros (e.g., `{remainingTime%05f}` → `100.0`)
 * - `%.Mf` - Float with M decimal places (e.g., `{remainingTime%.2f}` → `100.00`)
 * - `%hh:mm:ss` - Time format with hours (e.g., `{remainingTime%hh:mm:ss}` → `00:01:40`)
 * - `%mm:ss` - Time format without hours (e.g., `{remainingTime%mm:ss}` → `01:40`)
 *
 * Example: `{ text: 'Ad: {remainingTime%mm:ss}' }` displays "Ad: 01:40" for 100 seconds remaining.
 *
 * Note: If a LinearAd has a `uiConfig.message` property, it takes precedence over the configured `text`.
 *
 * @category Labels
 */
var AdMessageLabel = /** @class */ (function (_super) {
    __extends(AdMessageLabel, _super);
    function AdMessageLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-ad-message-label',
        }, _this.config);
        return _this;
    }
    AdMessageLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var text = config.text || '';
        var updateMessageHandler = function () {
            _this.setText(StringUtils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(text), player));
        };
        var adStartHandler = function (event) {
            var uiConfig = event.ad.uiConfig;
            text = (uiConfig === null || uiConfig === void 0 ? void 0 : uiConfig.message) || config.text || '';
            updateMessageHandler();
            player.on(player.exports.PlayerEvent.TimeChanged, updateMessageHandler);
        };
        var adEndHandler = function () {
            player.off(player.exports.PlayerEvent.TimeChanged, updateMessageHandler);
        };
        player.on(player.exports.PlayerEvent.AdStarted, adStartHandler);
        player.on(player.exports.PlayerEvent.AdSkipped, adEndHandler);
        player.on(player.exports.PlayerEvent.AdError, adEndHandler);
        player.on(player.exports.PlayerEvent.AdFinished, adEndHandler);
        player.on(player.exports.PlayerEvent.SourceUnloaded, adEndHandler);
    };
    return AdMessageLabel;
}(Label_1.Label));
exports.AdMessageLabel = AdMessageLabel;
