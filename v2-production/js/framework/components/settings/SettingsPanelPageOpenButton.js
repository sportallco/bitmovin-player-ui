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
exports.SettingsPanelPageOpenButton = void 0;
var SettingsPanelPageNavigatorButton_1 = require("./SettingsPanelPageNavigatorButton");
var i18n_1 = require("../../localization/i18n");
/**
 * @category Buttons
 */
var SettingsPanelPageOpenButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageOpenButton, _super);
    function SettingsPanelPageOpenButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-navigation-text-button',
            text: i18n_1.i18n.getLocalizer('settings.subtitles.options'),
            role: 'menuitem',
        }, _this.config);
        return _this;
    }
    SettingsPanelPageOpenButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.getDomElement().attr('aria-haspopup', 'true');
        this.getDomElement().attr('aria-owns', this.config.targetPage.getConfig().id);
        this.onClick.subscribe(function () {
            _this.pushTargetPage();
        });
    };
    return SettingsPanelPageOpenButton;
}(SettingsPanelPageNavigatorButton_1.SettingsPanelPageNavigatorButton));
exports.SettingsPanelPageOpenButton = SettingsPanelPageOpenButton;
