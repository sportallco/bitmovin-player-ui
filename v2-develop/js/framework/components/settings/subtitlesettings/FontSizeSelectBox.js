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
exports.FontSizeSelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different font sizes.
 *
 * @category Components
 */
var FontSizeSelectBox = /** @class */ (function (_super) {
    __extends(FontSizeSelectBox, _super);
    function FontSizeSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsfontsizeselectbox'],
        }, _this.config);
        return _this;
    }
    FontSizeSelectBox.prototype.getFontSizeOptions = function () {
        return [
            { key: null, label: i18n_1.i18n.getLocalizer('default') },
            { key: '50', label: i18n_1.i18n.getLocalizer('percent', { value: 50 }) },
            { key: '75', label: i18n_1.i18n.getLocalizer('percent', { value: 75 }) },
            { key: '100', label: i18n_1.i18n.getLocalizer('percent', { value: 100 }) },
            { key: '150', label: i18n_1.i18n.getLocalizer('percent', { value: 150 }) },
            { key: '200', label: i18n_1.i18n.getLocalizer('percent', { value: 200 }) },
            { key: '300', label: i18n_1.i18n.getLocalizer('percent', { value: 300 }) },
            { key: '400', label: i18n_1.i18n.getLocalizer('percent', { value: 400 }) },
        ];
    };
    FontSizeSelectBox.prototype.populateItemsWithFilter = function () {
        this.clearItems();
        for (var _i = 0, _a = this.getFontSizeOptions(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (!this.config.filter || this.config.filter(item)) {
                this.addItem(item.key, item.label);
            }
        }
        if (this.settingsManager.fontSize.isSet()) {
            this.selectItem(this.settingsManager.fontSize.value);
        }
    };
    FontSizeSelectBox.prototype.reapplyFilterAndReload = function () {
        this.populateItemsWithFilter();
    };
    FontSizeSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.settingsManager.fontSize.onChanged.subscribe(function (sender, property) {
            if (property.isSet()) {
                _this.toggleOverlayClass('fontsize-' + property.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
            _this.selectItem(property.value);
        });
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            _this.settingsManager.fontSize.value = key;
        });
        this.onShow.subscribe(function () {
            _this.populateItemsWithFilter();
        });
        // init
        this.populateItemsWithFilter();
        this.initFromSettings();
    };
    FontSizeSelectBox.prototype.initFromSettings = function () {
        if (this.settingsManager.fontSize.isSet()) {
            this.toggleOverlayClass('fontsize-' + this.settingsManager.fontSize.value);
        }
    };
    return FontSizeSelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.FontSizeSelectBox = FontSizeSelectBox;
