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
exports.FontFamilySelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different font family.
 *
 * @category Components
 */
var FontFamilySelectBox = /** @class */ (function (_super) {
    __extends(FontFamilySelectBox, _super);
    function FontFamilySelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsfontfamilyselectbox'],
        }, _this.config);
        return _this;
    }
    FontFamilySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('monospacedserif', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.monospacedserif'));
        this.addItem('proportionalserif', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.proportionalserif'));
        this.addItem('monospacedsansserif', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.monospacedsansserif'));
        this.addItem('proportionalsansserif', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.proportionalsansserif'));
        this.addItem('casual', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.casual'));
        this.addItem('cursive', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.cursive'));
        this.addItem('smallcapital', i18n_1.i18n.getLocalizer('settings.subtitles.font.family.smallcapital'));
        this.settingsManager.fontFamily.onChanged.subscribe(function (sender, property) {
            if (property.isSet()) {
                _this.toggleOverlayClass('fontfamily-' + property.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
            // Select the item in case the property was set from outside
            _this.selectItem(property.value);
        });
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            _this.settingsManager.fontFamily.value = key;
        });
        // Load initial value
        if (this.settingsManager.fontFamily.isSet()) {
            this.selectItem(this.settingsManager.fontFamily.value);
        }
    };
    return FontFamilySelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.FontFamilySelectBox = FontFamilySelectBox;
