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
exports.SettingsPanelPageNavigatorButton = void 0;
var Button_1 = require("../buttons/Button");
/**
 * Can be used to navigate between SettingsPanelPages
 *
 * Example:
 *  let settingPanelNavigationButton = new SettingsPanelPageNavigatorButton({
 *    container: settingsPanel,
 *    targetPage: settingsPanelPage,
 *  });
 *
 *  settingsPanelPage.addComponent(settingPanelNavigationButton);
 *
 * Don't forget to add the settingPanelNavigationButton to the settingsPanelPage.
 *
 * @category Buttons
 */
var SettingsPanelPageNavigatorButton = /** @class */ (function (_super) {
    __extends(SettingsPanelPageNavigatorButton, _super);
    function SettingsPanelPageNavigatorButton(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            buttonStyle: Button_1.ButtonStyle.Text,
        }, _this.config);
        _this.container = _this.config.container;
        _this.targetPage = _this.config.targetPage;
        return _this;
    }
    /**
     * navigate one level back
     */
    SettingsPanelPageNavigatorButton.prototype.popPage = function () {
        this.container.popSettingsPanelPage();
    };
    /**
     * navigate to the target page
     */
    SettingsPanelPageNavigatorButton.prototype.pushTargetPage = function () {
        this.container.setActivePage(this.targetPage);
    };
    return SettingsPanelPageNavigatorButton;
}(Button_1.Button));
exports.SettingsPanelPageNavigatorButton = SettingsPanelPageNavigatorButton;
