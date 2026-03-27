"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusableContainer = void 0;
var resolveAllComponents_1 = require("./helper/resolveAllComponents");
var TypeGuards_1 = require("./TypeGuards");
/**
 * Enables grouping of focusable components within a container.
 * Spatial navigation can prioritize elements within this container over others.
 * The primary component is the one that receives focus first when the container is focused.
 */
var FocusableContainer = /** @class */ (function () {
    /**
     * Creates a new FocusableContainer.
     *
     * @param container The container that holds focusable components.
     * @param primaryComponent The primary component that should receive focus first when the container is focused.
     *                         If not provided, the first focusable component in the container will be used.
     */
    function FocusableContainer(container, primaryComponent) {
        if (primaryComponent === void 0) { primaryComponent = undefined; }
        this.container = container;
        this._primaryComponent = primaryComponent;
        if (primaryComponent && !this.components.includes(primaryComponent)) {
            throw new Error('The primary component must be part of the container.');
        }
    }
    Object.defineProperty(FocusableContainer.prototype, "primaryComponent", {
        get: function () {
            var _a;
            return (_a = this._primaryComponent) !== null && _a !== void 0 ? _a : this.components[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusableContainer.prototype, "components", {
        get: function () {
            return (0, resolveAllComponents_1.resolveAllComponents)(this.container).filter(function (component) { return (0, TypeGuards_1.isFocusable)(component); });
        },
        enumerable: false,
        configurable: true
    });
    return FocusableContainer;
}());
exports.FocusableContainer = FocusableContainer;
