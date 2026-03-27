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
exports.prefixCss = prefixCss;
var Component_1 = require("./Component");
var DummyComponent = /** @class */ (function (_super) {
    __extends(DummyComponent, _super);
    function DummyComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyComponent.instance = function () {
        if (!DummyComponent._instance) {
            DummyComponent._instance = new DummyComponent();
        }
        return DummyComponent._instance;
    };
    DummyComponent.prototype.prefixCss = function (cssClassOrId) {
        return _super.prototype.prefixCss.call(this, cssClassOrId);
    };
    return DummyComponent;
}(Component_1.Component));
/**
 * Prefixes any CSS Class or ID with the configured prefix.
 */
function prefixCss(cssClassOrId) {
    return DummyComponent.instance().prefixCss(cssClassOrId);
}
