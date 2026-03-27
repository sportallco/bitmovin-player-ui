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
exports.SubtitleSettingSelectBox = void 0;
var SelectBox_1 = require("../SelectBox");
/**
 * Base class for all subtitles settings select box
 *
 * @category Components
 **/
var SubtitleSettingSelectBox = /** @class */ (function (_super) {
    __extends(SubtitleSettingSelectBox, _super);
    function SubtitleSettingSelectBox(config) {
        var _this = _super.call(this, config) || this;
        _this.overlay = config.overlay;
        return _this;
    }
    /**
     * Removes a previously set class and adds the passed in class.
     * @param cssClass The new class to replace the previous class with or null to just remove the previous class
     */
    SubtitleSettingSelectBox.prototype.toggleOverlayClass = function (cssClass) {
        // Remove previous class if existing
        if (this.currentCssClass) {
            this.overlay.getDomElement().removeClass(this.currentCssClass);
            this.currentCssClass = null;
        }
        // Add new class if specified. If the new class is null, we don't add anything.
        if (cssClass) {
            this.currentCssClass = this.prefixCss(cssClass);
            this.overlay.getDomElement().addClass(this.currentCssClass);
        }
    };
    SubtitleSettingSelectBox.prototype.configure = function (player, uimanager) {
        this.settingsManager = uimanager.getSubtitleSettingsManager();
    };
    return SubtitleSettingSelectBox;
}(SelectBox_1.SelectBox));
exports.SubtitleSettingSelectBox = SubtitleSettingSelectBox;
