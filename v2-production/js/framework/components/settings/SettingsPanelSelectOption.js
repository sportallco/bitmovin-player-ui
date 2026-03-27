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
exports.SettingsPanelSelectOption = void 0;
var InteractiveSettingsPanelItem_1 = require("./InteractiveSettingsPanelItem");
/**
 * A custom select option for a {@link ListSelector} option.
 * Is used for building dynamic sub pages from a {@link DynamicSettingsPanelItem}.
 *
 * @category Components
 */
var SettingsPanelSelectOption = /** @class */ (function (_super) {
    __extends(SettingsPanelSelectOption, _super);
    function SettingsPanelSelectOption(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsValue = config.settingsValue;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-settings-panel-item-select-option'],
            role: 'menuitem',
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    SettingsPanelSelectOption.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var handleSelectedOptionChanged = function () {
            var selectedItem = _this.settingComponent.getSelectedItem();
            if (_this.settingsValue === selectedItem) {
                _this.getDomElement().addClass(_this.prefixCss('selected'));
            }
            else {
                _this.getDomElement().removeClass(_this.prefixCss('selected'));
            }
        };
        this.settingComponent.onItemSelected.subscribe(handleSelectedOptionChanged);
        this.onClick.subscribe(function () {
            _this.settingComponent.dispatchItemSelectionChanged(_this.settingsValue);
        });
        // Initial state
        handleSelectedOptionChanged();
    };
    return SettingsPanelSelectOption;
}(InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem));
exports.SettingsPanelSelectOption = SettingsPanelSelectOption;
