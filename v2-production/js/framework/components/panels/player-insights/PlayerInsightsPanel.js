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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInsightsPanel = void 0;
var PlayerInsightsProvider_1 = require("../../../utils/PlayerInsightsProvider");
var SettingsPanel_1 = require("../../settings/SettingsPanel");
var SettingsPanelPage_1 = require("../../settings/SettingsPanelPage");
var PlayerInsightsPanelItem_1 = require("./PlayerInsightsPanelItem");
var PlayerInsightsPanelTitleItem_1 = require("./PlayerInsightsPanelTitleItem");
/**
 * Player diagnostics panel composed from settings-panel rows.
 *
 * @category Components
 */
var PlayerInsightsPanel = /** @class */ (function (_super) {
    __extends(PlayerInsightsPanel, _super);
    function PlayerInsightsPanel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.playerInsightsChangedHandler = function (_, snapshots) {
            snapshots.forEach(function (snapshot, index) {
                var item = _this.insightItems[index];
                if (!item) {
                    return;
                }
                if (snapshot.visible) {
                    item.show();
                }
                else {
                    item.hide();
                }
                if (snapshot.value != null && snapshot.value !== '') {
                    item.setTrailingLabel(snapshot.value);
                }
            });
        };
        var insightsProvider = new PlayerInsightsProvider_1.PlayerInsightsProvider();
        var insightItems = insightsProvider.getInsights().map(function (insight) {
            return new PlayerInsightsPanelItem_1.PlayerInsightsPanelItem({
                leadingLabel: insight.leadingLabel,
            });
        });
        var titleItem = new PlayerInsightsPanelTitleItem_1.PlayerInsightsPanelTitleItem();
        var rootPage = new SettingsPanelPage_1.SettingsPanelPage({
            components: __spreadArray([titleItem], insightItems, true),
        });
        titleItem.setTarget(_this);
        _this.insightsProvider = insightsProvider;
        _this.insightItems = insightItems;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-player-insights-panel'],
            hidden: true,
            hideDelay: -1,
            hideOnControlsHide: false,
            hideOnOtherSettingsPanelOpening: false,
            refreshIntervalMs: 1000,
        }, _this.config);
        _this.addComponent(rootPage);
        return _this;
    }
    PlayerInsightsPanel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.insightsProvider.onChanged.subscribe(this.playerInsightsChangedHandler);
        this.insightsProvider.initialize(player, uimanager, this.config.refreshIntervalMs);
        this.onShow.subscribe(function () { return _this.insightsProvider.activate(); });
        this.onHide.subscribe(function () { return _this.insightsProvider.deactivate(); });
    };
    PlayerInsightsPanel.prototype.release = function () {
        this.insightsProvider.release();
        _super.prototype.release.call(this);
    };
    return PlayerInsightsPanel;
}(SettingsPanel_1.SettingsPanel));
exports.PlayerInsightsPanel = PlayerInsightsPanel;
