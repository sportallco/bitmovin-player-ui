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
exports.SubtitleSettingsPanelPage = void 0;
var SettingsPanelPage_1 = require("../SettingsPanelPage");
var FontSizeSelectBox_1 = require("./FontSizeSelectBox");
var FontFamilySelectBox_1 = require("./FontFamilySelectBox");
var FontColorSelectBox_1 = require("./FontColorSelectBox");
var FontOpacitySelectBox_1 = require("./FontOpacitySelectBox");
var CharacterEdgeSelectBox_1 = require("./CharacterEdgeSelectBox");
var BackgroundColorSelectBox_1 = require("./BackgroundColorSelectBox");
var BackgroundOpacitySelectBox_1 = require("./BackgroundOpacitySelectBox");
var WindowColorSelectBox_1 = require("./WindowColorSelectBox");
var WindowOpacitySelectBox_1 = require("./WindowOpacitySelectBox");
var SubtitleSettingsResetButton_1 = require("./SubtitleSettingsResetButton");
var SettingsPanelPageBackButton_1 = require("../SettingsPanelPageBackButton");
var SettingsPanelItem_1 = require("../SettingsPanelItem");
var i18n_1 = require("../../../localization/i18n");
var DynamicSettingsPanelItem_1 = require("../DynamicSettingsPanelItem");
var FontStyleSelectBox_1 = require("./FontStyleSelectBox");
var CharacterEdgeColorSelectBox_1 = require("./CharacterEdgeColorSelectBox");
/**
 * @category Components
 */
var SubtitleSettingsPanelPage = /** @class */ (function (_super) {
    __extends(SubtitleSettingsPanelPage, _super);
    function SubtitleSettingsPanelPage(config) {
        var _this = _super.call(this, config) || this;
        _this.overlay = config.overlay;
        _this.settingsPanel = config.settingsPanel;
        var components = [
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.size'), new FontSizeSelectBox_1.FontSizeSelectBox({
                overlay: _this.overlay,
                filter: function (item) { return _this.overlay.filterFontSizeOptions(item); },
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.style'), new FontStyleSelectBox_1.FontStyleSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.family'), new FontFamilySelectBox_1.FontFamilySelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.color'), new FontColorSelectBox_1.FontColorSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.font.opacity'), new FontOpacitySelectBox_1.FontOpacitySelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge'), new CharacterEdgeSelectBox_1.CharacterEdgeSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.color'), new CharacterEdgeColorSelectBox_1.CharacterEdgeColorSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.background.color'), new BackgroundColorSelectBox_1.BackgroundColorSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.background.opacity'), new BackgroundOpacitySelectBox_1.BackgroundOpacitySelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.window.color'), new WindowColorSelectBox_1.WindowColorSelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
            _this.buildSettingsPanelItem(i18n_1.i18n.getLocalizer('settings.subtitles.window.opacity'), new WindowOpacitySelectBox_1.WindowOpacitySelectBox({
                overlay: _this.overlay,
            }), config.useDynamicSettingsPanelItem),
        ];
        var backItem = new SettingsPanelItem_1.SettingsPanelItem({
            label: new SettingsPanelPageBackButton_1.SettingsPanelPageBackButton({
                container: _this.settingsPanel,
            }),
            settingComponent: new SubtitleSettingsResetButton_1.SubtitleSettingsResetButton({}),
            cssClasses: ['title-item'],
            isSetting: false,
        });
        if (config.useDynamicSettingsPanelItem) {
            components.unshift(backItem);
        }
        else {
            components.push(backItem);
        }
        _this.config = _this.mergeConfig(config, {
            components: components,
        }, _this.config);
        return _this;
    }
    SubtitleSettingsPanelPage.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.onActive.subscribe(function () {
            _this.overlay.enablePreviewSubtitleLabel();
            // Dynamically reapply font size filter
            var fontSizeComponent = _this.getComponents().find(function (component) {
                return component instanceof SettingsPanelItem_1.SettingsPanelItem && component.getComponents().some(function (c) { return c instanceof FontSizeSelectBox_1.FontSizeSelectBox; });
            });
            if (fontSizeComponent) {
                var fontSizeSelectBox = fontSizeComponent
                    .getComponents()
                    .find(function (c) { return c instanceof FontSizeSelectBox_1.FontSizeSelectBox; });
                fontSizeSelectBox === null || fontSizeSelectBox === void 0 ? void 0 : fontSizeSelectBox.reapplyFilterAndReload();
            }
        });
        this.onInactive.subscribe(function () {
            _this.overlay.removePreviewSubtitleLabel();
        });
    };
    SubtitleSettingsPanelPage.prototype.buildSettingsPanelItem = function (label, setting, useDynamicSettingsPanelItem) {
        if (useDynamicSettingsPanelItem === void 0) { useDynamicSettingsPanelItem = false; }
        if (useDynamicSettingsPanelItem) {
            return new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
                label: label,
                settingComponent: setting,
                container: this.settingsPanel,
            });
        }
        else {
            return new SettingsPanelItem_1.SettingsPanelItem({
                label: label,
                settingComponent: setting,
            });
        }
    };
    return SubtitleSettingsPanelPage;
}(SettingsPanelPage_1.SettingsPanelPage));
exports.SubtitleSettingsPanelPage = SubtitleSettingsPanelPage;
