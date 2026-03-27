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
exports.DynamicSettingsPanelItem = void 0;
var Label_1 = require("../labels/Label");
var i18n_1 = require("../../localization/i18n");
var SubtitleSelectBox_1 = require("./SubtitleSelectBox");
var SettingsPanelItem_1 = require("./SettingsPanelItem");
var SettingsPanelSelectOption_1 = require("./SettingsPanelSelectOption");
var SettingsPanelPage_1 = require("./SettingsPanelPage");
var SettingsPanelPageBackButton_1 = require("./SettingsPanelPageBackButton");
var SubtitleSettingSelectBox_1 = require("./subtitlesettings/SubtitleSettingSelectBox");
var InteractiveSettingsPanelItem_1 = require("./InteractiveSettingsPanelItem");
/**
 * A dynamic settings panel item which can build a sub page with the items of a {@link ListSelector}.
 * The page will be dynamically added and removed from the {@link SettingsPanel}.
 *
 * @category Components
 */
var DynamicSettingsPanelItem = /** @class */ (function (_super) {
    __extends(DynamicSettingsPanelItem, _super);
    function DynamicSettingsPanelItem(config) {
        var _this = _super.call(this, config) || this;
        _this.handleSelectedItemChanged = function () {
            var selectedItem = _this.settingComponent.getItemForKey(_this.settingComponent.getSelectedItem());
            if (selectedItem == null) {
                _this.selectedOptionLabel.setText('-');
                return;
            }
            var selectedOptionLabelText = selectedItem.label;
            if (_this.settingComponent instanceof SubtitleSelectBox_1.SubtitleSelectBox) {
                var availableSettings = _this.settingComponent.getItems().length;
                selectedOptionLabelText =
                    i18n_1.i18n.performLocalization(selectedOptionLabelText) + ' (' + (availableSettings - 1) + ')';
            }
            _this.selectedOptionLabel.setText(selectedOptionLabelText);
        };
        _this.backNavigationRightComponent = config.backNavigationRightComponent;
        _this.settingComponent = config.settingComponent;
        _this.selectedOptionLabel = new Label_1.Label({
            text: '-',
            for: _this.getConfig().id,
            cssClasses: ['ui-label-setting-selected-option'],
            labelStyle: Label_1.LabelStyle.TextWithTrailingIcon,
        });
        _this.config = _this.mergeConfig(config, {
            components: [_this.selectedOptionLabel],
            cssClass: 'ui-settings-panel-item',
            role: 'menuitem',
            addSettingAsComponent: false,
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    DynamicSettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        this.uimanager = uimanager;
        if (this.backNavigationRightComponent != null) {
            this.backNavigationRightComponent.configure(this.player, this.uimanager);
        }
        if (this.settingComponent != null) {
            this.settingComponent.configure(this.player, this.uimanager);
        }
        this.settingComponent.onItemSelected.subscribe(this.handleSelectedItemChanged);
        this.handleSelectedItemChanged();
        this.onClick.subscribe(function () {
            _this.displayItemsSubPage();
        });
    };
    DynamicSettingsPanelItem.prototype.onLanguageChanged = function () {
        this.handleSelectedItemChanged();
    };
    DynamicSettingsPanelItem.prototype.buildSubPanelPage = function () {
        var _this = this;
        var menuOptions = this.settingComponent.getItems();
        var page = new SettingsPanelPage_1.SettingsPanelPage({ removeOnPop: true });
        var text = this.config.label;
        var backButton = new SettingsPanelPageBackButton_1.SettingsPanelPageBackButton({
            text: text,
            container: this.config.container,
        });
        backButton.configure(this.player, this.uimanager);
        var backSettingsPanelItem = new SettingsPanelItem_1.SettingsPanelItem({
            label: backButton,
            settingComponent: this.backNavigationRightComponent,
            cssClasses: ['title-item'],
            isSetting: false,
        });
        backSettingsPanelItem.configure(this.player, this.uimanager);
        page.addComponent(backSettingsPanelItem);
        menuOptions
            .map(function (option) {
            return new SettingsPanelSelectOption_1.SettingsPanelSelectOption({
                label: option.label,
                labelStyle: Label_1.LabelStyle.TextWithLeadingIcon,
                settingComponent: _this.settingComponent,
                settingsValue: option.key,
                addSettingAsComponent: false,
            });
        })
            .forEach(function (selectOption) {
            selectOption.configure(_this.player, _this.uimanager);
            page.addComponent(selectOption);
        });
        page.configure(this.player, this.uimanager);
        var setting = this.settingComponent;
        if (setting instanceof SubtitleSettingSelectBox_1.SubtitleSettingSelectBox) {
            // Keep the preview subtitle overlay visible when the sub-page is for a subtitle setting
            page.onActive.subscribe(function () { return setting.overlay.enablePreviewSubtitleLabel(); });
            page.onInactive.subscribe(function () { return setting.overlay.removePreviewSubtitleLabel(); });
        }
        return page;
    };
    DynamicSettingsPanelItem.prototype.displayItemsSubPage = function () {
        var page = this.buildSubPanelPage();
        this.config.container.addPage(page);
        this.config.container.setActivePage(page);
    };
    return DynamicSettingsPanelItem;
}(InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem));
exports.DynamicSettingsPanelItem = DynamicSettingsPanelItem;
