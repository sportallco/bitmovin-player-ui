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
exports.SettingsPanelPageBackButton = void 0;
var SettingsPanelPageNavigatorButton_1 = require("./SettingsPanelPageNavigatorButton");
var i18n_1 = require("../../localization/i18n");
var Button_1 = require("../buttons/Button");
/**
 * @category Buttons
 */
var SettingsPanelPageBackButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageBackButton, _super);
    function SettingsPanelPageBackButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingspanelpagebackbutton',
            text: i18n_1.i18n.getLocalizer('back'),
            buttonStyle: Button_1.ButtonStyle.TextWithLeadingIcon,
        }, _this.config);
        return _this;
    }
    SettingsPanelPageBackButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            _this.popPage();
        });
    };
    return SettingsPanelPageBackButton;
}(SettingsPanelPageNavigatorButton_1.SettingsPanelPageNavigatorButton));
exports.SettingsPanelPageBackButton = SettingsPanelPageBackButton;
