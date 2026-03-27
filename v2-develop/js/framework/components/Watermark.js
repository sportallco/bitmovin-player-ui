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
exports.Watermark = void 0;
var ClickOverlay_1 = require("./overlays/ClickOverlay");
var i18n_1 = require("../localization/i18n");
/**
 * A watermark overlay with a clickable logo.
 *
 * @category Components
 */
var Watermark = /** @class */ (function (_super) {
    __extends(Watermark, _super);
    function Watermark(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-watermark',
            url: 'http://bitmovin.com',
            role: 'link',
            text: 'logo',
            ariaLabel: i18n_1.i18n.getLocalizer('watermarkLink'),
        }, _this.config);
        return _this;
    }
    return Watermark;
}(ClickOverlay_1.ClickOverlay));
exports.Watermark = Watermark;
