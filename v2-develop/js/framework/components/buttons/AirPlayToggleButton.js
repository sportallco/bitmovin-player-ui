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
exports.AirPlayToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles Apple AirPlay.
 *
 * @category Buttons
 */
var AirPlayToggleButton = /** @class */ (function (_super) {
    __extends(AirPlayToggleButton, _super);
    function AirPlayToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-airplaytogglebutton',
            text: i18n_1.i18n.getLocalizer('appleAirplay'),
        }, _this.config);
        return _this;
    }
    AirPlayToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        if (!player.isAirplayAvailable) {
            // If the player does not support Airplay (player 7.0), we just hide this component and skip configuration
            this.hide();
            return;
        }
        this.onClick.subscribe(function () {
            if (player.isAirplayAvailable()) {
                player.showAirplayTargetPicker();
            }
            else {
                if (console) {
                    console.log('AirPlay unavailable');
                }
            }
        });
        var airPlayAvailableHandler = function () {
            if (player.isAirplayAvailable()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        var airPlayChangedHandler = function () {
            if (player.isAirplayActive()) {
                _this.on();
            }
            else {
                _this.off();
            }
        };
        player.on(player.exports.PlayerEvent.AirplayAvailable, airPlayAvailableHandler);
        player.on(player.exports.PlayerEvent.AirplayChanged, airPlayChangedHandler);
        // Startup init
        airPlayAvailableHandler(); // Hide button if AirPlay is not available
        airPlayChangedHandler();
    };
    return AirPlayToggleButton;
}(ToggleButton_1.ToggleButton));
exports.AirPlayToggleButton = AirPlayToggleButton;
