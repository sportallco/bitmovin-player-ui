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
exports.SettingsPanelNavigationGroup = exports.SettingsPanelNavigationGroupConfig = void 0;
var NavigationGroup_1 = require("./NavigationGroup");
var types_1 = require("./types");
var resolveAllComponents_1 = require("./helper/resolveAllComponents");
var SettingsPanelSelectOption_1 = require("../components/settings/SettingsPanelSelectOption");
var DynamicSettingsPanelItem_1 = require("../components/settings/DynamicSettingsPanelItem");
var SettingsPanelNavigationGroupConfig = /** @class */ (function () {
    function SettingsPanelNavigationGroupConfig() {
    }
    return SettingsPanelNavigationGroupConfig;
}());
exports.SettingsPanelNavigationGroupConfig = SettingsPanelNavigationGroupConfig;
/**
 * Extend NavigationGroup to provide additional logic for navigating within a SettingsPanel.
 *
 * @category Components
 */
var SettingsPanelNavigationGroup = /** @class */ (function (_super) {
    __extends(SettingsPanelNavigationGroup, _super);
    function SettingsPanelNavigationGroup(settingsPanel, config) {
        if (config === void 0) { config = undefined; }
        var _this = this;
        var settingsPanelPage = settingsPanel.getRootPage();
        var components = settingsPanelPage.getItems();
        _this = _super.apply(this, __spreadArray([settingsPanel], components, false)) || this;
        _this.settingsPanel = settingsPanel;
        _this.config = Object.assign({}, _this.config, {
            closeOnSelect: true,
        }, config);
        // The SettingsPanel is created and updated dynamically. To keep the navigation working between pages,
        // we need to listen to page changes and reset the active component form the previous page and focus on
        // the first component of the new page.
        settingsPanel.onActivePageChanged.subscribe(function () {
            _this.activeComponent = undefined;
            _this.focusFirstComponent();
        });
        return _this;
    }
    // Dynamically resolve all components from the SettingsPanels active page. The SettingsPanel is crated dynamically and
    // during navigating between pages. To keep the navigation working, we need to resolve all components lazy.
    SettingsPanelNavigationGroup.prototype.getComponents = function () {
        var activeSettingsPanelPage = this.settingsPanel.getActivePage();
        var pageComponents = activeSettingsPanelPage.getItems();
        var componentsToConsider = [];
        pageComponents.forEach(function (component) {
            if (component instanceof SettingsPanelSelectOption_1.SettingsPanelSelectOption) {
                componentsToConsider.push(component);
            }
            else if (component instanceof DynamicSettingsPanelItem_1.DynamicSettingsPanelItem) {
                componentsToConsider.push(component);
            }
            else {
                componentsToConsider.push.apply(componentsToConsider, (0, resolveAllComponents_1.resolveAllComponents)(component));
            }
        });
        return componentsToConsider;
    };
    SettingsPanelNavigationGroup.prototype.defaultActionHandler = function (action) {
        if (action === types_1.Action.BACK) {
            this.settingsPanel.popSettingsPanelPage();
            return;
        }
        if (action === types_1.Action.SELECT) {
            // Ensure that the click event is triggered on the focused component before handling the navigation.
            _super.prototype.defaultActionHandler.call(this, action);
            if (this.config.closeOnSelect) {
                this.settingsPanel.hide();
                _super.prototype.defaultActionHandler.call(this, types_1.Action.BACK);
            }
            return;
        }
        _super.prototype.defaultActionHandler.call(this, action);
    };
    return SettingsPanelNavigationGroup;
}(NavigationGroup_1.NavigationGroup));
exports.SettingsPanelNavigationGroup = SettingsPanelNavigationGroup;
