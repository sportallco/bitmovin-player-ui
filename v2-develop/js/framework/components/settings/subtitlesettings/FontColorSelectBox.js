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
exports.FontColorSelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different font colors.
 *
 * @category Components
 */
var FontColorSelectBox = /** @class */ (function (_super) {
    __extends(FontColorSelectBox, _super);
    function FontColorSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsfontcolorselectbox'],
        }, _this.config);
        return _this;
    }
    FontColorSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('white', i18n_1.i18n.getLocalizer('colors.white'));
        this.addItem('black', i18n_1.i18n.getLocalizer('colors.black'));
        this.addItem('red', i18n_1.i18n.getLocalizer('colors.red'));
        this.addItem('green', i18n_1.i18n.getLocalizer('colors.green'));
        this.addItem('blue', i18n_1.i18n.getLocalizer('colors.blue'));
        this.addItem('cyan', i18n_1.i18n.getLocalizer('colors.cyan'));
        this.addItem('yellow', i18n_1.i18n.getLocalizer('colors.yellow'));
        this.addItem('magenta', i18n_1.i18n.getLocalizer('colors.magenta'));
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            _this.settingsManager.fontColor.value = key;
        });
        this.settingsManager.fontColor.onChanged.subscribe(function (sender, property) {
            // Color and opacity go together, so we need to...
            if (!_this.settingsManager.fontColor.isSet()) {
                // ... clear the opacity when the color is not set
                _this.settingsManager.fontOpacity.clear();
            }
            else if (!_this.settingsManager.fontOpacity.isSet()) {
                // ... set an opacity when the color is set
                _this.settingsManager.fontOpacity.value = '100';
            }
            _this.selectItem(property.value);
            _this.setColorAndOpacity();
        });
        this.settingsManager.fontOpacity.onChanged.subscribe(function () {
            _this.setColorAndOpacity();
        });
        this.initFromSettings();
    };
    FontColorSelectBox.prototype.initFromSettings = function () {
        if (this.settingsManager.fontColor.isSet()) {
            this.selectItem(this.settingsManager.fontColor.value);
            this.setColorAndOpacity();
        }
    };
    FontColorSelectBox.prototype.setColorAndOpacity = function () {
        if (this.settingsManager.fontColor.isSet() && this.settingsManager.fontOpacity.isSet()) {
            this.toggleOverlayClass('fontcolor-' + this.settingsManager.fontColor.value + this.settingsManager.fontOpacity.value);
        }
        else {
            this.toggleOverlayClass(null);
        }
    };
    return FontColorSelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.FontColorSelectBox = FontColorSelectBox;
