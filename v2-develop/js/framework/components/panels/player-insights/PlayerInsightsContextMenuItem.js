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
exports.PlayerInsightsContextMenuItem = void 0;
var i18n_1 = require("../../../localization/i18n");
var InteractiveContextMenuItem_1 = require("../../contextmenu/InteractiveContextMenuItem");
var Label_1 = require("../../labels/Label");
/**
 * A context menu item that toggles a {@link PlayerInsightsPanel}.
 *
 * @category Components
 */
var PlayerInsightsContextMenuItem = /** @class */ (function (_super) {
    __extends(PlayerInsightsContextMenuItem, _super);
    function PlayerInsightsContextMenuItem(config) {
        var _this = _super.call(this, config) || this;
        var itemLabel = new Label_1.Label({
            text: i18n_1.i18n.getLocalizer('playerInsights.show'),
        });
        _this.config = _this.mergeConfig(config, {
            ariaLabel: i18n_1.i18n.getLocalizer('playerInsights.show'),
            closeContextMenuOnAction: true,
        }, _this.config);
        _this.itemLabel = itemLabel;
        _this.playerInsightsPanel = config.playerInsightsPanel;
        _this.addComponent(itemLabel);
        return _this;
    }
    PlayerInsightsContextMenuItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var updateText = function () {
            var text = _this.playerInsightsPanel.isShown()
                ? i18n_1.i18n.getLocalizer('playerInsights.hide')
                : i18n_1.i18n.getLocalizer('playerInsights.show');
            _this.itemLabel.setText(text);
            _this.setAriaLabel(text);
        };
        this.playerInsightsPanel.onShow.subscribe(updateText);
        this.playerInsightsPanel.onHide.subscribe(updateText);
        this.onClick.subscribe(function () { return _this.playerInsightsPanel.toggleHidden(); });
        updateText();
    };
    return PlayerInsightsContextMenuItem;
}(InteractiveContextMenuItem_1.InteractiveContextMenuItem));
exports.PlayerInsightsContextMenuItem = PlayerInsightsContextMenuItem;
