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
exports.EcoModeToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * @category Buttons
 */
var EcoModeToggleButton = /** @class */ (function (_super) {
    __extends(EcoModeToggleButton, _super);
    function EcoModeToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        var defaultConfig = {
            text: i18n_1.i18n.getLocalizer('ecoMode'),
            cssClass: 'ui-ecomodetogglebutton',
            onClass: 'on',
            offClass: 'off',
            ariaLabel: i18n_1.i18n.getLocalizer('ecoMode'),
        };
        _this.config = _this.mergeConfig(config, defaultConfig, _this.config);
        return _this;
    }
    EcoModeToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        if (this.areAdaptationApisAvailable(player)) {
            this.onClick.subscribe(function () {
                _this.toggle();
            });
            this.onToggleOn.subscribe(function () {
                _this.enableEcoMode(player);
                player.setVideoQuality('auto');
            });
            this.onToggleOff.subscribe(function () {
                _this.disableEcoMode(player);
            });
            player.on(player.exports.PlayerEvent.VideoQualityChanged, function (quality) {
                if (quality.targetQuality.id !== 'auto') {
                    _this.off();
                    _this.disableEcoMode(player);
                }
            });
        }
        else {
            _super.prototype.disable.call(this);
        }
    };
    EcoModeToggleButton.prototype.areAdaptationApisAvailable = function (player) {
        var isGetConfigAvailable = Boolean(player.adaptation.getConfig && typeof player.adaptation.getConfig === 'function');
        var isSetConfigAvailable = Boolean(player.adaptation.setConfig && typeof player.adaptation.setConfig === 'function');
        return Boolean(player.adaptation && isGetConfigAvailable && isSetConfigAvailable);
    };
    EcoModeToggleButton.prototype.enableEcoMode = function (player) {
        this.adaptationConfig = player.adaptation.getConfig();
        var codec = player.getAvailableVideoQualities()[0].codec;
        if (codec.includes('avc')) {
            player.adaptation.setConfig({
                resolution: { maxSelectableVideoHeight: 720 },
                limitToPlayerSize: true,
            });
        }
        if (codec.includes('hvc') || codec.includes('hev')) {
            player.adaptation.setConfig({
                resolution: { maxSelectableVideoHeight: 1080 },
                limitToPlayerSize: true,
            });
        }
        if (codec.includes('av1') || codec.includes('av01')) {
            player.adaptation.setConfig({
                resolution: { maxSelectableVideoHeight: 1440 },
                limitToPlayerSize: true,
            });
        }
    };
    EcoModeToggleButton.prototype.disableEcoMode = function (player) {
        player.adaptation.setConfig(this.adaptationConfig);
    };
    return EcoModeToggleButton;
}(ToggleButton_1.ToggleButton));
exports.EcoModeToggleButton = EcoModeToggleButton;
