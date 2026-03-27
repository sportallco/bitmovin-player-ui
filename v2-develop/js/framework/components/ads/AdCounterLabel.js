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
exports.AdCounterLabel = void 0;
var i18n_1 = require("../../localization/i18n");
var Label_1 = require("../labels/Label");
var StringUtils_1 = require("../../utils/StringUtils");
/**
 * A label that displays the index of the currently playing ad out of the total number of ads.
 *
 * @category Labels
 */
var AdCounterLabel = /** @class */ (function (_super) {
    __extends(AdCounterLabel, _super);
    function AdCounterLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.updateLabelText = function () {
            if (!_this.player) {
                return;
            }
            _this.setText(StringUtils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(_this.config.adCountOutOfTotal), _this.player));
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label-ad-counter',
            adCountOutOfTotal: i18n_1.i18n.getLocalizer('ads.adNumberOfTotal'),
        }, _this.config);
        return _this;
    }
    AdCounterLabel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        var clearText = function () {
            _this.setText('');
        };
        player.on(player.exports.PlayerEvent.AdStarted, function () {
            _this.updateLabelText();
        });
        player.on(player.exports.PlayerEvent.AdBreakStarted, clearText);
        player.on(player.exports.PlayerEvent.AdBreakFinished, clearText);
    };
    AdCounterLabel.prototype.onLanguageChanged = function () {
        var _a, _b, _c;
        if ((_c = (_b = (_a = this.player) === null || _a === void 0 ? void 0 : _a.ads) === null || _b === void 0 ? void 0 : _b.isLinearAdActive) === null || _c === void 0 ? void 0 : _c.call(_b)) {
            this.updateLabelText();
        }
    };
    return AdCounterLabel;
}(Label_1.Label));
exports.AdCounterLabel = AdCounterLabel;
