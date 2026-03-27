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
exports.Icon = void 0;
var Component_1 = require("./Component");
var DOM_1 = require("../DOM");
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    function Icon(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-icon',
        }, _this.config);
        return _this;
    }
    Icon.prototype.toDomElement = function () {
        return new DOM_1.DOM('div', {
            class: this.getCssClasses(),
        });
    };
    return Icon;
}(Component_1.Component));
exports.Icon = Icon;
