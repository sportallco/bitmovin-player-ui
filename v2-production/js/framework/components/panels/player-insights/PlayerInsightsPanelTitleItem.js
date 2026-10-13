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
exports.PlayerInsightsPanelTitleItem = void 0;
var i18n_1 = require("../../../localization/i18n");
var Button_1 = require("../../buttons/Button");
var Label_1 = require("../../labels/Label");
var SettingsPanelItem_1 = require("../../settings/SettingsPanelItem");
var PlayerInsightsPanelTitleItem = /** @class */ (function (_super) {
    __extends(PlayerInsightsPanelTitleItem, _super);
    function PlayerInsightsPanelTitleItem(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.target = null;
        var titleLabel = new Label_1.Label({
            text: 'Player Insights',
            cssClasses: ['ui-player-insights-panel-title-label'],
        });
        var closeButton = new Button_1.Button({
            cssClass: 'ui-closebutton',
            cssClasses: ['ui-player-insights-panel-close-button'],
            text: i18n_1.i18n.getLocalizer('close'),
        });
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['title-item', 'ui-player-insights-panel-title-item'],
            isSetting: false,
            role: 'group',
            tabIndex: -1,
        }, _this.config);
        _this.closeButton = closeButton;
        _this.addComponent(titleLabel);
        _this.addComponent(closeButton);
        return _this;
    }
    PlayerInsightsPanelTitleItem.prototype.setTarget = function (target) {
        this.target = target;
    };
    PlayerInsightsPanelTitleItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.closeButton.onClick.subscribe(function () {
            var _a;
            (_a = _this.target) === null || _a === void 0 ? void 0 : _a.hide();
        });
    };
    return PlayerInsightsPanelTitleItem;
}(SettingsPanelItem_1.SettingsPanelItem));
exports.PlayerInsightsPanelTitleItem = PlayerInsightsPanelTitleItem;
