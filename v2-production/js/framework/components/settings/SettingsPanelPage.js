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
exports.SettingsPanelPage = void 0;
var Container_1 = require("../Container");
var SettingsPanelItem_1 = require("./SettingsPanelItem");
var EventDispatcher_1 = require("../../EventDispatcher");
var BrowserUtils_1 = require("../../utils/BrowserUtils");
var InteractiveSettingsPanelItem_1 = require("./InteractiveSettingsPanelItem");
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 *
 * @category Components
 */
var SettingsPanelPage = /** @class */ (function (_super) {
    __extends(SettingsPanelPage, _super);
    function SettingsPanelPage(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsPanelPageEvents = {
            onSettingsStateChanged: new EventDispatcher_1.EventDispatcher(),
            onActive: new EventDispatcher_1.EventDispatcher(),
            onInactive: new EventDispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-page',
            role: 'menu',
            removeOnPop: false,
        }, _this.config);
        return _this;
    }
    SettingsPanelPage.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Fire event when the state of a settings-item has changed
        var settingsStateChangedHandler = function () {
            _this.onSettingsStateChangedEvent();
            // Attach marker class to last visible item
            var lastShownItem = null;
            for (var _i = 0, _a = _this.getItems(); _i < _a.length; _i++) {
                var component = _a[_i];
                component.getDomElement().removeClass(_this.prefixCss(SettingsPanelPage.CLASS_LAST));
                if (component.isShown()) {
                    lastShownItem = component;
                }
            }
            if (lastShownItem) {
                lastShownItem.getDomElement().addClass(_this.prefixCss(SettingsPanelPage.CLASS_LAST));
            }
        };
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            component.onActiveChanged.subscribe(settingsStateChangedHandler);
        }
    };
    SettingsPanelPage.prototype.hasActiveSettings = function () {
        for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
            var component = _a[_i];
            if (component.getConfig().isSetting && component.isActive()) {
                return true;
            }
        }
        return false;
    };
    SettingsPanelPage.prototype.getItems = function () {
        return (this.config.components.filter(function (component) { return component instanceof SettingsPanelItem_1.SettingsPanelItem; }));
    };
    SettingsPanelPage.prototype.onSettingsStateChangedEvent = function () {
        this.settingsPanelPageEvents.onSettingsStateChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onSettingsStateChanged", {
        get: function () {
            return this.settingsPanelPageEvents.onSettingsStateChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanelPage.prototype.onActiveEvent = function () {
        var activeItems = this.getItems().filter(function (item) { return item.isActive() && item.getConfig().isSetting; });
        this.settingsPanelPageEvents.onActive.dispatch(this);
        // Disable focus for iOS and iPadOS 13. They open select boxes automatically on focus and we want to avoid that.
        if (activeItems.length > 0 && !BrowserUtils_1.BrowserUtils.isIOS && !(BrowserUtils_1.BrowserUtils.isMacIntel && BrowserUtils_1.BrowserUtils.isTouchSupported)) {
            if (activeItems[0] instanceof InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem) {
                activeItems[0].getDomElement().get(0).focus();
            }
            else {
                activeItems[0].getDomElement().focusToFirstInput();
            }
        }
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onActive", {
        get: function () {
            return this.settingsPanelPageEvents.onActive.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanelPage.prototype.onInactiveEvent = function () {
        this.settingsPanelPageEvents.onInactive.dispatch(this);
    };
    Object.defineProperty(SettingsPanelPage.prototype, "onInactive", {
        get: function () {
            return this.settingsPanelPageEvents.onInactive.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dynamically add a settings panel item to the page.
     */
    SettingsPanelPage.prototype.addSettingsPanelItem = function (settingsPanelItem) {
        this.addComponent(settingsPanelItem);
        this.updateComponents();
    };
    /**
     * Dynamically remove a settings panel item from the page.
     */
    SettingsPanelPage.prototype.removeSettingsPanelItem = function (settingsPanelItem) {
        this.removeComponent(settingsPanelItem);
        this.updateComponents();
    };
    SettingsPanelPage.CLASS_LAST = 'last';
    return SettingsPanelPage;
}(Container_1.Container));
exports.SettingsPanelPage = SettingsPanelPage;
