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
exports.PlayerContextMenu = void 0;
var i18n_1 = require("../../localization/i18n");
var version_1 = require("../../version");
var Label_1 = require("../labels/Label");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
var TimestampLinkUtils_1 = require("../../utils/TimestampLinkUtils");
var ContextMenu_1 = require("./ContextMenu");
var PlayerInsightsContextMenuItem_1 = require("../panels/player-insights/PlayerInsightsContextMenuItem");
var InteractiveContextMenuItem_1 = require("./InteractiveContextMenuItem");
var SettingsPanelItem_1 = require("../settings/SettingsPanelItem");
var SettingsPanelPage_1 = require("../settings/SettingsPanelPage");
var SettingsPanelSeparator_1 = require("../settings/SettingsPanelSeparator");
/**
 * A player-specific context menu with Bitmovin info and Player/UI versions.
 *
 * @category Components
 */
var PlayerContextMenu = /** @class */ (function (_super) {
    __extends(PlayerContextMenu, _super);
    function PlayerContextMenu(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-player-context-menu'],
        }, _this.config);
        var copyTimestampLinkItem = new InteractiveContextMenuItem_1.InteractiveContextMenuItem({
            label: new Label_1.Label({
                text: i18n_1.i18n.getLocalizer('contextMenu.copyTimestampLink'),
            }),
            ariaLabel: i18n_1.i18n.getLocalizer('contextMenu.copyTimestampLink'),
            closeContextMenuOnAction: true,
        });
        _this.copyTimestampLinkItem = copyTimestampLinkItem;
        _this.addComponent(new SettingsPanelPage_1.SettingsPanelPage({
            components: [
                new PlayerInfoContextMenuItem(),
                new SettingsPanelSeparator_1.SettingsPanelSeparator(),
                new PlayerInsightsContextMenuItem_1.PlayerInsightsContextMenuItem({
                    playerInsightsPanel: config.playerInsightsPanel,
                }),
                copyTimestampLinkItem,
            ],
        }));
        return _this;
    }
    PlayerContextMenu.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.copyTimestampLinkItem.onClick.subscribe(function () {
            var _a;
            var timestampLink = TimestampLinkUtils_1.TimestampLinkUtils.buildTimestampLink(player.getCurrentTime());
            if (!((_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText)) {
                console.warn('Clipboard API is not available. Timestamp link was not copied.');
                return;
            }
            navigator.clipboard
                .writeText(timestampLink)
                .catch(function () { return console.warn('Failed to copy timestamp link to clipboard.'); });
        });
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            if (!uimanager.getConfig().enableTimestampDeepLink || args.live) {
                _this.copyTimestampLinkItem.hide();
            }
            else {
                _this.copyTimestampLinkItem.show();
            }
        });
        liveStreamDetector.detect();
    };
    return PlayerContextMenu;
}(ContextMenu_1.ContextMenu));
exports.PlayerContextMenu = PlayerContextMenu;
var PlayerInfoContextMenuItem = /** @class */ (function (_super) {
    __extends(PlayerInfoContextMenuItem, _super);
    function PlayerInfoContextMenuItem(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        var playerVersionLabel = new Label_1.Label({
            text: 'Player: -',
            cssClasses: ['ui-player-context-menu-info'],
        });
        _this.config = _this.mergeConfig(config, {
            label: null,
            cssClasses: ['ui-player-context-menu-info-item'],
            isSetting: false,
            role: 'group',
            tabIndex: -1,
        }, _this.config);
        _this.playerVersionLabel = playerVersionLabel;
        _this.addComponent(new Label_1.Label({
            text: i18n_1.i18n.getLocalizer('contextMenu.title'),
            cssClasses: ['ui-player-context-menu-header'],
        }));
        _this.addComponent(new Label_1.Label({
            text: i18n_1.i18n.getLocalizer('contextMenu.subtitle'),
            cssClasses: ['ui-player-context-menu-subtitle'],
        }));
        _this.addComponent(playerVersionLabel);
        _this.addComponent(new Label_1.Label({
            text: "UI: ".concat(version_1.version),
            cssClasses: ['ui-player-context-menu-info'],
        }));
        return _this;
    }
    PlayerInfoContextMenuItem.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.playerVersionLabel.setText("Player: ".concat(player.version));
    };
    return PlayerInfoContextMenuItem;
}(SettingsPanelItem_1.SettingsPanelItem));
