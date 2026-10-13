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
exports.PlayerInsightsPanelItem = void 0;
var Label_1 = require("../../labels/Label");
var SettingsPanelItem_1 = require("../../settings/SettingsPanelItem");
var PlayerInsightsPanelItem = /** @class */ (function (_super) {
    __extends(PlayerInsightsPanelItem, _super);
    function PlayerInsightsPanelItem(config) {
        var _this = _super.call(this, config) || this;
        var leadingLabel = new Label_1.Label({
            text: config.leadingLabel,
            cssClasses: ['ui-player-insights-panel-item-leading-label'],
        });
        var trailingLabel = new Label_1.Label({
            text: '-',
            cssClasses: ['ui-player-insights-panel-item-trailing-label'],
        });
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-player-insights-panel-item'],
            isSetting: false,
            role: 'group',
            tabIndex: -1,
        }, _this.config);
        _this.trailingLabel = trailingLabel;
        _this.addComponent(leadingLabel);
        _this.addComponent(trailingLabel);
        return _this;
    }
    PlayerInsightsPanelItem.prototype.setTrailingLabel = function (text) {
        this.trailingLabel.setText(text);
    };
    return PlayerInsightsPanelItem;
}(SettingsPanelItem_1.SettingsPanelItem));
exports.PlayerInsightsPanelItem = PlayerInsightsPanelItem;
