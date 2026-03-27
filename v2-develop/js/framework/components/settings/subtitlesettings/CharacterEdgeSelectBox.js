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
exports.CharacterEdgeSelectBox = void 0;
var SubtitleSettingSelectBox_1 = require("./SubtitleSettingSelectBox");
var i18n_1 = require("../../../localization/i18n");
/**
 * A select box providing a selection of different character edge.
 *
 * @category Components
 */
var CharacterEdgeSelectBox = /** @class */ (function (_super) {
    __extends(CharacterEdgeSelectBox, _super);
    function CharacterEdgeSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-subtitlesettingscharacteredgeselectbox'],
        }, _this.config);
        return _this;
    }
    CharacterEdgeSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addItem(null, i18n_1.i18n.getLocalizer('default'));
        this.addItem('raised', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.raised'));
        this.addItem('depressed', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.depressed'));
        this.addItem('uniform', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.uniform'));
        this.addItem('dropshadowed', i18n_1.i18n.getLocalizer('settings.subtitles.characterEdge.dropshadowed'));
        var setColorAndEdgeType = function () {
            if (_this.settingsManager.characterEdge.isSet() && _this.settingsManager.characterEdgeColor.isSet()) {
                _this.toggleOverlayClass('characteredge-' +
                    _this.settingsManager.characterEdge.value +
                    '-' +
                    _this.settingsManager.characterEdgeColor.value);
            }
            else {
                _this.toggleOverlayClass(null);
            }
        };
        this.onItemSelectionChanged.subscribe(function (sender, key) {
            _this.settingsManager.characterEdge.value = key;
        });
        this.settingsManager.characterEdge.onChanged.subscribe(function (sender, property) {
            // Edge type and color go together, so we need to...
            if (!_this.settingsManager.characterEdge.isSet()) {
                // ... clear the color when the edge type is not set
                _this.settingsManager.characterEdgeColor.clear();
            }
            else if (!_this.settingsManager.characterEdgeColor.isSet()) {
                // ... set a color when the edge type is set
                _this.settingsManager.characterEdgeColor.value = 'black';
            }
            _this.selectItem(property.value);
            setColorAndEdgeType();
        });
        this.settingsManager.characterEdgeColor.onChanged.subscribe(function () {
            setColorAndEdgeType();
        });
        // Load initial value
        if (this.settingsManager.characterEdge.isSet()) {
            this.selectItem(this.settingsManager.characterEdge.value);
        }
    };
    return CharacterEdgeSelectBox;
}(SubtitleSettingSelectBox_1.SubtitleSettingSelectBox));
exports.CharacterEdgeSelectBox = CharacterEdgeSelectBox;
