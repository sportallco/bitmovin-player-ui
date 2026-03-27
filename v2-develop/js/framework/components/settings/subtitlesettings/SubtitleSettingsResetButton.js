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
exports.SubtitleSettingsResetButton = void 0;
var Button_1 = require("../../buttons/Button");
var i18n_1 = require("../../../localization/i18n");
/**
 * A button that resets all subtitle settings to their defaults.
 *
 * @category Buttons
 */
var SubtitleSettingsResetButton = /** @class */ (function (_super) {
    __extends(SubtitleSettingsResetButton, _super);
    function SubtitleSettingsResetButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-navigation-text-button',
            text: i18n_1.i18n.getLocalizer('reset'),
            buttonStyle: Button_1.ButtonStyle.Text,
        }, _this.config);
        return _this;
    }
    SubtitleSettingsResetButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.settingsManager = uimanager.getSubtitleSettingsManager();
        this.onClick.subscribe(function () {
            _this.settingsManager.reset();
        });
    };
    return SubtitleSettingsResetButton;
}(Button_1.Button));
exports.SubtitleSettingsResetButton = SubtitleSettingsResetButton;
