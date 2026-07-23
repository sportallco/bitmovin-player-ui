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
exports.FontStyleSelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different font styles.
 *
 * @category Components
 */
var FontStyleSelectBox = /** @class */ (function (_super) {
    __extends(FontStyleSelectBox, _super);
    function FontStyleSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitle-settings-font-style-select-box'],
        }, _this.config);
        return _this;
    }
    FontStyleSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        var _a;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('italic', i18n_1.i18n.getLocalizer('settings.subtitles.font.style.italic'));
        this.addItem('bold', i18n_1.i18n.getLocalizer('settings.subtitles.font.style.bold'));
        (_a = this.settingsManager) === null || _a === void 0 ? void 0 : _a.fontStyle.onChanged.subscribe(function (sender, property) {
            if (property.isSet()) {
                _this.toggleOverlayClass('fontstyle-' + property.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
            // Select the item in case the property was set from outside
            _this.selectItem(property.value);
        });
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            if (_this.settingsManager) {
                _this.settingsManager.fontStyle.value = key;
            }
        });
        this.initFromSettings();
    };
    FontStyleSelectBox.prototype.initFromSettings = function () {
        var _a;
        if ((_a = this.settingsManager) === null || _a === void 0 ? void 0 : _a.fontStyle.isSet()) {
            this.selectItem(this.settingsManager.fontStyle.value);
            this.toggleOverlayClass('fontstyle-' + this.settingsManager.fontStyle.value);
        }
    };
    return FontStyleSelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.FontStyleSelectBox = FontStyleSelectBox;
