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
        // Setting both ariaLabels on the parent ToggleButton suppresses its default
        // `aria-pressed` attribute (see the ToggleButtonConfig.ariaLabel doc) so we don't end
        // up announcing both pressed/unpressed *and* expanded/collapsed for the same widget.
        // Using the same localizer for both states keeps the announced name stable.
        var settingsLabel = i18n_1.i18n.getLocalizer('settings');
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settingstogglebutton',
            text: settingsLabel,
            onAriaLabel: settingsLabel,
            offAriaLabel: settingsLabel,
            settingsPanel: null,
            autoHideWhenNoActiveSettings: true,
        }, _this.config);
        // The element renders as a native `<button>` (with the explicit `role="button"`
        // inherited from the Button base). aria-haspopup="menu" advertises that activation
        // reveals a menu, and aria-controls points assistive tech at the panel id, which
        // is refreshed whenever the panel's active page changes (see `configure`).
        // We intentionally do not set aria-owns: when it points at the same element as
        // aria-controls, iOS VoiceOver follows both relationships and announces the menu
        // twice. The WAI-ARIA APG menu button pattern uses aria-controls alone.
        _this.getDomElement().attr('aria-haspopup', 'menu');
        _this.updateAriaPanelIdRefs();
        _this.getDomElement().attr('aria-expanded', 'false');
        return _this;
    }
    SettingsToggleButton.prototype.updateAriaPanelIdRefs = function () {
        var settingsPanel = this.getConfig().settingsPanel;
        if (!settingsPanel)
            return;
        var settingsPanelId = settingsPanel.getActivePage().getConfig().id;
        this.getDomElement().attr('aria-controls', settingsPanelId);
    };
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
                _this.visibleSettingsPanels
                    .slice()
                    .filter(function (settingsPanel) { return settingsPanel.getConfig().hideOnOtherSettingsPanelOpening; })
                    .forEach(function (settingsPanel) { return settingsPanel.hide(); });
            }
            settingsPanel.toggleHidden();
        });
        settingsPanel.onShow.subscribe(function () {
            // Set toggle status to on when the settings panel shows
            _this.on();
            _this.getDomElement().attr('aria-expanded', 'true');
        });
        settingsPanel.onHide.subscribe(function () {
            // Set toggle status to off when the settings panel hides
            _this.off();
            _this.getDomElement().attr('aria-expanded', 'false');
        });
        // Keep aria-controls / aria-owns pointing at the *currently* active page id —
        // the user may navigate into sub-pages while the panel is open.
        settingsPanel.onActivePageChanged.subscribe(function () { return _this.updateAriaPanelIdRefs(); });
        // Sync aria-expanded with the panel's current visibility in case the panel was
        // already shown before `configure()` ran (`hidden: false`, manual `show()`, etc.).
        this.getDomElement().attr('aria-expanded', settingsPanel.isShown() ? 'true' : 'false');
        // Ensure that only one `SettingPanel` is visible at once
        // Keep track of shown SettingsPanels
        uimanager.onComponentShow.subscribe(function (sender) {
            if (sender instanceof SettingsPanel_1.SettingsPanel && sender.getConfig().hideOnOtherSettingsPanelOpening) {
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
