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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootNavigationGroup = void 0;
var NavigationGroup_1 = require("./NavigationGroup");
var types_1 = require("./types");
/**
 * Extends NavigationGroup and provides additional logic for hiding and showing the UI on the root container.
 *
 * @category Components
 */
var RootNavigationGroup = /** @class */ (function (_super) {
    __extends(RootNavigationGroup, _super);
    function RootNavigationGroup(container) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        var _this = _super.apply(this, __spreadArray([container], elements, false)) || this;
        _this.container = container;
        return _this;
    }
    RootNavigationGroup.prototype.handleAction = function (action) {
        if (action !== types_1.Action.BACK) {
            this.container.showUi();
        }
        return _super.prototype.handleAction.call(this, action);
    };
    RootNavigationGroup.prototype.handleNavigation = function (direction) {
        this.container.showUi();
        return _super.prototype.handleNavigation.call(this, direction);
    };
    RootNavigationGroup.prototype.defaultActionHandler = function (action) {
        if (action !== types_1.Action.BACK) {
            return _super.prototype.defaultActionHandler.call(this, action);
        }
        if (!this.isUiShown()) {
            return false;
        }
        this.container.hideUi();
        return true;
    };
    RootNavigationGroup.prototype.isUiShown = function () {
        var _a;
        var classList = (_a = this.container.getDomElement().get(0)) === null || _a === void 0 ? void 0 : _a.classList;
        if (!classList) {
            return false;
        }
        return Array.from(classList).some(function (className) { return /-controls-shown$/.test(className); });
    };
    RootNavigationGroup.prototype.release = function () {
        _super.prototype.release.call(this);
    };
    return RootNavigationGroup;
}(NavigationGroup_1.NavigationGroup));
exports.RootNavigationGroup = RootNavigationGroup;
