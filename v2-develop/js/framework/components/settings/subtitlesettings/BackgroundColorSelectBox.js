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
exports.BackgroundColorSelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different background colors.
 *
 * @category Components
 */
var BackgroundColorSelectBox = /** @class */ (function (_super) {
    __extends(BackgroundColorSelectBox, _super);
    function BackgroundColorSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingsbackgroundcolorselectbox'],
        }, _this.config);
        return _this;
    }
    BackgroundColorSelectBox.prototype.configure = function (player, uimanager) {
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
            _this.settingsManager.backgroundColor.value = key;
        });
        this.settingsManager.backgroundColor.onChanged.subscribe(function (sender, property) {
            // Color and opacity go together, so we need to...
            if (!_this.settingsManager.backgroundColor.isSet()) {
                // ... clear the opacity when the color is not set
                _this.settingsManager.backgroundOpacity.clear();
            }
            else if (!_this.settingsManager.backgroundOpacity.isSet()) {
                // ... set an opacity when the color is set
                _this.settingsManager.backgroundOpacity.value = '100';
            }
            _this.selectItem(property.value);
            _this.setColorAndOpacity();
        });
        this.settingsManager.backgroundOpacity.onChanged.subscribe(function () {
            _this.setColorAndOpacity();
        });
        this.initFromSettings();
    };
    BackgroundColorSelectBox.prototype.initFromSettings = function () {
        if (this.settingsManager.backgroundColor.isSet()) {
            this.selectItem(this.settingsManager.backgroundColor.value);
            this.setColorAndOpacity();
        }
    };
    BackgroundColorSelectBox.prototype.setColorAndOpacity = function () {
        if (this.settingsManager.backgroundColor.isSet() && this.settingsManager.backgroundOpacity.isSet()) {
            this.toggleOverlayClass('bgcolor-' + this.settingsManager.backgroundColor.value + this.settingsManager.backgroundOpacity.value);
        }
        else {
            this.toggleOverlayClass(null);
        }
    };
    return BackgroundColorSelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.BackgroundColorSelectBox = BackgroundColorSelectBox;
