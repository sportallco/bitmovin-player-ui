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
exports.ListBox = void 0;
var SettingsPanel_1 = require("../settings/SettingsPanel");
var SettingsPanelPage_1 = require("../settings/SettingsPanelPage");
var SettingsPanelSelectOption_1 = require("../settings/SettingsPanelSelectOption");
var SettingsPanelItem_1 = require("../settings/SettingsPanelItem");
var Label_1 = require("../labels/Label");
var ListBox = /** @class */ (function (_super) {
    __extends(ListBox, _super);
    function ListBox(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsPanelPage = new SettingsPanelPage_1.SettingsPanelPage({});
        _this.listSelector = config.listSelector;
        _this.config = _this.mergeConfig(config, {
            hidden: true,
            cssClasses: ['ui-listbox'],
        }, _this.config);
        _this.addComponent(_this.settingsPanelPage);
        if (config.title) {
            var label = new Label_1.Label({ text: config.title, cssClasses: ['title-label'] });
            _this.settingsPanelPage.addComponent(new SettingsPanelItem_1.SettingsPanelItem({
                label: label,
                cssClasses: ['title-item'],
                isSetting: false,
            }));
        }
        return _this;
    }
    ListBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var onItemAdded = function (_, itemKey) {
            var item = _this.listSelector.getItemForKey(itemKey);
            var selectOption = new SettingsPanelSelectOption_1.SettingsPanelSelectOption({
                label: item.label,
                labelStyle: Label_1.LabelStyle.TextWithLeadingIcon,
                settingComponent: _this.listSelector,
                settingsValue: item.key,
                addSettingAsComponent: false,
            });
            selectOption.configure(player, uimanager);
            _this.settingsPanelPage.addSettingsPanelItem(selectOption);
            _this.onSettingsStateChangedEvent();
        };
        var onItemRemoved = function (_, itemKey) {
            var settingsPanelItem = _this.settingsPanelPage.getComponents().find(function (item) {
                if (!(item instanceof SettingsPanelSelectOption_1.SettingsPanelSelectOption)) {
                    return false;
                }
                return item.getConfig().settingsValue === itemKey;
            });
            if (!settingsPanelItem || !(settingsPanelItem instanceof SettingsPanelItem_1.SettingsPanelItem)) {
                return;
            }
            _this.settingsPanelPage.removeSettingsPanelItem(settingsPanelItem);
            _this.onSettingsStateChangedEvent();
        };
        this.listSelector.onItemAdded.subscribe(onItemAdded);
        this.listSelector.onItemRemoved.subscribe(onItemRemoved);
        this.settingsPanelPage.configure(player, uimanager);
        this.listSelector.configure(player, uimanager);
    };
    return ListBox;
}(SettingsPanel_1.SettingsPanel));
exports.ListBox = ListBox;
