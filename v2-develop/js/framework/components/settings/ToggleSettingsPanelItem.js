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
exports.ToggleSettingsPanelItem = void 0;
var InteractiveSettingsPanelItem_1 = require("./InteractiveSettingsPanelItem");
/**
 * A settings panel item that toggles a {@link ToggleButton} when the row is clicked.
 *
 * @category Components
 */
var ToggleSettingsPanelItem = /** @class */ (function (_super) {
    __extends(ToggleSettingsPanelItem, _super);
    function ToggleSettingsPanelItem(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-toggle-settings-panel-item'],
            role: 'menuitemcheckbox',
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    ToggleSettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Keyboard, click, and accessibility semantics belong to the row. Disabling it on the ToggleButton explicitly.
        this.settingComponent.getDomElement().attr('tabindex', '-1');
        this.settingComponent.setAriaAttr('hidden', 'true');
        this.settingComponent.getDomElement().on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            _this.onClickEvent();
        }, true);
        // Mirror the disabled state from the ToggleButton to the row
        var updateDisabledState = function () {
            _this.setAriaAttr('disabled', _this.settingComponent.isDisabled() ? 'true' : 'false');
        };
        this.onClick.subscribe(function () {
            if (!_this.settingComponent.isDisabled()) {
                _this.settingComponent.toggle();
            }
        });
        this.settingComponent.onToggle.subscribe(function () { return _this.updateAriaChecked(); });
        this.settingComponent.onDisabled.subscribe(updateDisabledState);
        this.settingComponent.onEnabled.subscribe(updateDisabledState);
        this.updateAriaChecked();
        updateDisabledState();
    };
    ToggleSettingsPanelItem.prototype.updateAriaChecked = function () {
        this.getDomElement().attr('aria-checked', this.settingComponent.isOn() ? 'true' : 'false');
    };
    return ToggleSettingsPanelItem;
}(InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem));
exports.ToggleSettingsPanelItem = ToggleSettingsPanelItem;
