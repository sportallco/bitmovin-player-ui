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
exports.PersistentPreferencesToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A toggle that lets the end-user opt in to having their volume, mute and playback
 * speed remembered across sessions. Reflects and drives the {@link UIPreferencesManager}
 * `enabled` state. Only added to the UI when the integrator sets
 * `UIConfig.showPersistentPreferencesToggle`.
 *
 * @category Buttons
 */
var PersistentPreferencesToggleButton = /** @class */ (function (_super) {
    __extends(PersistentPreferencesToggleButton, _super);
    function PersistentPreferencesToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            text: i18n_1.i18n.getLocalizer('persistentPreferences'),
            cssClass: 'ui-persistentpreferencestogglebutton',
            ariaLabel: i18n_1.i18n.getLocalizer('persistentPreferences'),
        }, _this.config);
        return _this;
    }
    PersistentPreferencesToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var uiPreferencesManager = uimanager.getUIPreferencesManager();
        if (uiPreferencesManager.isEnabled()) {
            this.on();
        }
        this.onClick.subscribe(function () {
            _this.toggle();
        });
        this.onToggleOn.subscribe(function () {
            uiPreferencesManager.setEnabled(true);
        });
        this.onToggleOff.subscribe(function () {
            uiPreferencesManager.setEnabled(false);
        });
    };
    return PersistentPreferencesToggleButton;
}(ToggleButton_1.ToggleButton));
exports.PersistentPreferencesToggleButton = PersistentPreferencesToggleButton;
