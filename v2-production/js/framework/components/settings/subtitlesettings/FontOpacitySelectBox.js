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
exports.FontOpacitySelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different font colors.
 *
 * @category Components
 */
var FontOpacitySelectBox = /** @class */ (function (_super) {
    __extends(FontOpacitySelectBox, _super);
    function FontOpacitySelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsfontopacityselectbox'],
        }, _this.config);
        return _this;
    }
    FontOpacitySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('100', i18n_1.i18n.getLocalizer('percent', { value: 100 }));
        this.addItem('75', i18n_1.i18n.getLocalizer('percent', { value: 75 }));
        this.addItem('50', i18n_1.i18n.getLocalizer('percent', { value: 50 }));
        this.addItem('25', i18n_1.i18n.getLocalizer('percent', { value: 25 }));
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            _this.settingsManager.fontOpacity.value = key;
            // Color and opacity go together, so we need to...
            if (!_this.settingsManager.fontOpacity.isSet()) {
                // ... clear the color when the opacity is not set
                _this.settingsManager.fontColor.clear();
            }
            else if (!_this.settingsManager.fontColor.isSet()) {
                // ... set a color when the opacity is set
                _this.settingsManager.fontColor.value = 'white';
            }
        });
        // Update selected item when value is set from somewhere else
        this.settingsManager.fontOpacity.onChanged.subscribe(function (sender, property) {
            _this.selectItem(property.value);
        });
        this.initFromSettings();
    };
    FontOpacitySelectBox.prototype.initFromSettings = function () {
        if (this.settingsManager.fontOpacity.isSet()) {
            this.selectItem(this.settingsManager.fontOpacity.value);
        }
    };
    return FontOpacitySelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.FontOpacitySelectBox = FontOpacitySelectBox;
