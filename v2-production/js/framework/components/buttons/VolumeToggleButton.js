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
exports.VolumeToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles audio muting.
 *
 * @category Buttons
 */
var VolumeToggleButton = /** @class */ (function (_super) {
    __extends(VolumeToggleButton, _super);
    function VolumeToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        var defaultConfig = {
            cssClass: 'ui-volumetogglebutton',
            text: i18n_1.i18n.getLocalizer('settings.audio.mute'),
            onClass: 'muted',
            offClass: 'unmuted',
            ariaLabel: i18n_1.i18n.getLocalizer('settings.audio.mute'),
        };
        _this.config = _this.mergeConfig(config, defaultConfig, _this.config);
        return _this;
    }
    VolumeToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var volumeController = uimanager.getConfig().volumeController;
        volumeController.onChanged.subscribe(function (_, args) {
            if (args.muted) {
                _this.on();
            }
            else {
                _this.off();
            }
            var volumeLevelTens = Math.ceil(args.volume / 10);
            _this.getDomElement().data(_this.prefixCss('volume-level-tens'), String(volumeLevelTens));
        });
        this.onClick.subscribe(function () {
            volumeController.toggleMuted();
        });
        // Startup init
        volumeController.onChangedEvent();
    };
    return VolumeToggleButton;
}(ToggleButton_1.ToggleButton));
exports.VolumeToggleButton = VolumeToggleButton;
