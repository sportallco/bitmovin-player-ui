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
exports.SettingsToggleButton = void 0;
var ToggleButton_1 = require("../buttons/ToggleButton");
var SettingsPanel_1 = require("./SettingsPanel");
var ArrayUtils_1 = require("../../utils/ArrayUtils");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles visibility of a settings panel.
 *
 * @category Buttons
 */
var SettingsToggleButton = /** @class */ (function (_super) {
    __extends(SettingsToggleButton, _super);
    function SettingsToggleButton(config) {
        var _this = _super.call(this, config) || this;
        _this.visibleSettingsPanels = [];
        if (!config.settingsPanel) {
            throw new Error('Required SettingsPanel is missing');
        }
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingstogglebutton',
            text: i18n_1.i18n.getLocalizer('settings'),
            settingsPanel: null,
            autoHideWhenNoActiveSettings: true,
            role: 'pop-up button',
        }, _this.config);
        /**
         * WCAG20 standard defines which popup menu (element id) is owned by the button
         */
        _this.getDomElement().attr('aria-owns', config.settingsPanel.getActivePage().getConfig().id);
        /**
         * WCAG20 standard defines that a button has a popup menu bound to it
         */
        _this.getDomElement().attr('aria-haspopup', 'true');
        return _this;
    }
    SettingsToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var settingsPanel = config.settingsPanel;
        this.onClick.subscribe(function () {
            // only hide other `SettingsPanel`s if a new one will be opened
            if (!settingsPanel.isShown()) {
                // Hide all open SettingsPanels before opening this button's panel
                // (We need to iterate a copy because hiding them will automatically remove themselves from the array
                // due to the subscribeOnce above)
                _this.visibleSettingsPanels.slice().forEach(function (settingsPanel) { return settingsPanel.hide(); });
            }
            settingsPanel.toggleHidden();
        });
        settingsPanel.onShow.subscribe(function () {
            // Set toggle status to on when the settings panel shows
            _this.on();
        });
        settingsPanel.onHide.subscribe(function () {
            // Set toggle status to off when the settings panel hides
            _this.off();
        });
        // Ensure that only one `SettingPanel` is visible at once
        // Keep track of shown SettingsPanels
        uimanager.onComponentShow.subscribe(function (sender) {
            if (sender instanceof SettingsPanel_1.SettingsPanel) {
                _this.visibleSettingsPanels.push(sender);
                sender.onHide.subscribeOnce(function () { return ArrayUtils_1.ArrayUtils.remove(_this.visibleSettingsPanels, sender); });
            }
        });
        // Handle automatic hiding of the button if there are no settings for the user to interact with
        if (config.autoHideWhenNoActiveSettings) {
            // Setup handler to show/hide button when the settings change
            var settingsPanelItemsChangedHandler = function () {
                if (settingsPanel.rootPageHasActiveSettings()) {
                    if (_this.isHidden()) {
                        _this.show();
                    }
                }
                else {
                    if (_this.isShown()) {
                        _this.hide();
                    }
                }
            };
            // Wire the handler to the event
            settingsPanel.onSettingsStateChanged.subscribe(settingsPanelItemsChangedHandler);
            // Call handler for first init at startup
            settingsPanelItemsChangedHandler();
        }
    };
    return SettingsToggleButton;
}(ToggleButton_1.ToggleButton));
exports.SettingsToggleButton = SettingsToggleButton;
