"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGroup = void 0;
var Container_1 = require("../components/Container");
var NavigationAlgorithm_1 = require("./NavigationAlgorithm");
var resolveAllComponents_1 = require("./helper/resolveAllComponents");
var NodeEventSubscriber_1 = require("./NodeEventSubscriber");
var TypeGuards_1 = require("./TypeGuards");
var types_1 = require("./types");
var FocusableContainer_1 = require("./FocusableContainer");
var toHtmlElement_1 = require("./helper/toHtmlElement");
/**
 * Used as part of spatial navigation. Groups together different components to which you can navigate to, in a single
 * navigation group.
 *
 * Responsible for finding elements in direction on navigation and for tracking active element inside the group.
 * Triggers blur and focus on element when active element is changed, as well as click on element on `Action.SELECT`.
 * Will call `hideUi()` on passed in container if `Action.BACK` is called.
 *
 * To have more control over grouping related elements together, you can use `FocusableContainer`.
 *
 * Example 1:
 * <code>
 *   new RootNavigationGroup(uiContainer, playbackToggleOverlay, seekBar, bottomControlBar, titleBar)
 * </code>
 *
 * In this example all components which are passed to the `RootNavigationGroup` will be navigable on a 'flat' hierarchy.
 * Elements form within the bottomControlBar and the titleBar will be resolved lazily and it's possible to navigate
 * from/to every element.
 *
 * Example 2:
 * <code>
 *   new RootNavigationGroup(
 *     uiContainer, playbackToggleOverlay, seekBar, new FocusableContainer(bottomControlBar, playbackToggleButton), new FocusableContainer(titleBar)
 *   )
 * </code>
 *
 * In this example the bottomControlBar and the titleBar are considered as a group of elements. Their components
 * will still be resolved lazily, but the navigation will target the whole container instead of the individual
 * components. In addition, a primary component can be set for each `FocusableContainer`, which will be component that
 * receives focus first when the container is focused.
 *
 * @category Components
 */
var NavigationGroup = /** @class */ (function () {
    function NavigationGroup(container) {
        var components = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            components[_i - 1] = arguments[_i];
        }
        this.container = container;
        this.removeElementHoverEventListeners = function () { };
        this._components = components;
        this.eventSubscriber = new NodeEventSubscriber_1.NodeEventSubscriber();
    }
    // Dynamically resolve all components within this group respecting FocusableContainers.
    NavigationGroup.prototype.getComponents = function () {
        var componentsToConsider = [];
        var focusableContainers = this._components
            .filter(function (component) { return component instanceof FocusableContainer_1.FocusableContainer; })
            .map(function (component) { return component; });
        if (this.activeComponent) {
            var activeFocusableContainer = this.getActiveFocusableContainer();
            if (activeFocusableContainer) {
                // If the active component is wihtin a focusable container, we want to include all components of that container.
                componentsToConsider.push.apply(componentsToConsider, activeFocusableContainer.components);
            }
            else {
                // If the active component is not within a focusable container, we only want to include the container itself.
                componentsToConsider.push.apply(componentsToConsider, focusableContainers);
            }
        }
        // Add all non-focusable containers components and flat map other containers
        var components = this._components.filter(function (component) { return !(component instanceof FocusableContainer_1.FocusableContainer); });
        components.forEach(function (component) {
            if (component instanceof Container_1.Container) {
                componentsToConsider.push.apply(componentsToConsider, (0, resolveAllComponents_1.resolveAllComponents)(component));
            }
            else {
                componentsToConsider.push(component);
            }
        });
        return componentsToConsider.filter(function (component) { return (0, TypeGuards_1.isFocusable)(component); });
    };
    /**
     * Returns the active HTMLElement.
     */
    NavigationGroup.prototype.getActiveComponent = function () {
        return this.activeComponent;
    };
    NavigationGroup.prototype.focusComponent = function (component) {
        var targetComponent;
        if (component instanceof FocusableContainer_1.FocusableContainer) {
            targetComponent = component.primaryComponent;
        }
        else {
            targetComponent = component;
        }
        this.blurActiveComponent();
        this.activeComponent = targetComponent;
        (0, toHtmlElement_1.toHtmlElement)(this.activeComponent).focus();
    };
    NavigationGroup.prototype.blurActiveComponent = function () {
        if (!this.activeComponent) {
            return;
        }
        (0, toHtmlElement_1.toHtmlElement)(this.activeComponent).blur();
    };
    NavigationGroup.prototype.focusFirstComponent = function () {
        var component = this.getComponents()[0];
        if (component) {
            this.focusComponent(component);
        }
    };
    NavigationGroup.prototype.defaultNavigationHandler = function (direction) {
        var _this = this;
        if (!this.activeComponent) {
            return false;
        }
        var notifyAfterNavigation = function (target) {
            var selectedComponent = target instanceof FocusableContainer_1.FocusableContainer ? target.primaryComponent : target;
            if (_this.afterNavigation) {
                _this.afterNavigation(direction, selectedComponent);
            }
        };
        var containerContainingActiveComponent = this.getActiveFocusableContainer();
        if (containerContainingActiveComponent) {
            var targetComponent_1 = (0, NavigationAlgorithm_1.getComponentInDirection)(this.activeComponent, containerContainingActiveComponent.components, direction);
            if (targetComponent_1) {
                this.focusComponent(targetComponent_1);
                notifyAfterNavigation(targetComponent_1);
                return true;
            }
        }
        // If no component was found within the container itself, check all components within the group
        var targetComponent = (0, NavigationAlgorithm_1.getComponentInDirection)(this.activeComponent, this.getComponents(), direction);
        if (targetComponent) {
            this.focusComponent(targetComponent);
            notifyAfterNavigation(targetComponent);
            return true;
        }
        notifyAfterNavigation(targetComponent);
        return false;
    };
    NavigationGroup.prototype.defaultActionHandler = function (action) {
        switch (action) {
            case types_1.Action.SELECT:
                if (this.activeComponent) {
                    (0, toHtmlElement_1.toHtmlElement)(this.activeComponent).click();
                }
                return Boolean(this.activeComponent);
            case types_1.Action.BACK:
                this.container.hide();
                return true;
        }
        return false;
    };
    NavigationGroup.prototype.handleInput = function (data, defaultHandler, userHandler) {
        var handleDefault = true;
        var preventDefault = function () { return (handleDefault = false); };
        var handled = false;
        if (userHandler && this.activeComponent) {
            handled = Boolean(userHandler(data, this.activeComponent, preventDefault));
        }
        if (handleDefault) {
            var defaultHandled = defaultHandler.call(this, data);
            handled = handled || defaultHandled;
        }
        return handled;
    };
    /**
     * Handles a navigation event.
     *
     * @param direction The direction of the navigation event
     * @returns true if navigation was successful, false otherwise
     */
    NavigationGroup.prototype.handleNavigation = function (direction) {
        if (!this.activeComponent) {
            // If we do not have an active element, the active element has been disabled by a mouseleave
            // event. We should continue the navigation at the exact place where we left off.
            if (this.activeComponentBeforeDisable) {
                this.focusComponent(this.activeComponentBeforeDisable);
            }
            else {
                this.focusFirstComponent();
            }
            return Boolean(this.activeComponent);
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        return this.handleInput(direction, this.defaultNavigationHandler, this.onNavigation);
    };
    /**
     * Handles an action event.
     *
     * @param action The action of the event
     */
    NavigationGroup.prototype.handleAction = function (action) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        return this.handleInput(action, this.defaultActionHandler, this.onAction);
    };
    /**
     * Disable navigation group
     *
     * Call blur on active element, set as undefined, and track it as element before disable.
     */
    NavigationGroup.prototype.disable = function () {
        if (this.activeComponent) {
            this.activeComponentBeforeDisable = this.activeComponent;
            this.blurActiveComponent();
            this.activeComponent = undefined;
        }
    };
    /**
     * Enable navigation group
     *
     * Sets active element to either element that was active before disable, or first element of tracked elements.
     * If it is settings panel, it will always focus first element in the list.
     */
    NavigationGroup.prototype.enable = function () {
        if (this.activeComponentBeforeDisable && !(0, TypeGuards_1.isSettingsPanel)(this.container)) {
            this.focusComponent(this.activeComponentBeforeDisable);
            this.activeComponentBeforeDisable = undefined;
        }
        else {
            this.focusFirstComponent();
        }
        this.trackElementHover();
    };
    /**
     * Adds event listener for `mouseenter` on tracked elements to ensure tracking of active element will work together
     * in combination of using mouse and key events.
     */
    NavigationGroup.prototype.trackElementHover = function () {
        var _this = this;
        this.removeElementHoverEventListeners();
        var componentsToConsider = [];
        this.getComponents().forEach(function (component) {
            var elementsToConsider;
            if (component instanceof Container_1.Container) {
                elementsToConsider = (0, resolveAllComponents_1.resolveAllComponents)(component);
            }
            else if (component instanceof FocusableContainer_1.FocusableContainer) {
                elementsToConsider = (0, resolveAllComponents_1.resolveAllComponents)(component.container);
            }
            else {
                elementsToConsider = [component];
            }
            elementsToConsider.forEach(function (component) {
                componentsToConsider.push(component);
            });
        });
        var removeEventListenerFunctions = componentsToConsider
            .map(function (component) {
            return { component: component, element: (0, toHtmlElement_1.toHtmlElement)(component) };
        })
            .map(function (_a) {
            var element = _a.element, component = _a.component;
            var enterListener = _this.focusComponent.bind(_this, component);
            var exitListener = function () { return _this.disable(); };
            _this.eventSubscriber.on(element, 'mouseenter', enterListener);
            _this.eventSubscriber.on(element, 'mouseleave', exitListener);
            return function () {
                _this.eventSubscriber.off(element, 'mouseenter', enterListener);
                _this.eventSubscriber.off(element, 'mouseleave', exitListener);
            };
        });
        this.removeElementHoverEventListeners = function () { return removeEventListenerFunctions.forEach(function (fn) { return fn(); }); };
    };
    /**
     * Dispose of navigation group
     */
    NavigationGroup.prototype.release = function () {
        this.eventSubscriber.release();
        this.activeComponent = undefined;
        this._components.splice(0, this._components.length);
        this.removeElementHoverEventListeners();
    };
    NavigationGroup.prototype.getActiveFocusableContainer = function () {
        var _this = this;
        if (!this.activeComponent) {
            return undefined;
        }
        return this._components
            .filter(function (component) { return component instanceof FocusableContainer_1.FocusableContainer; })
            .map(function (component) { return component; })
            .find(function (container) { return container.components.includes(_this.activeComponent); });
    };
    return NavigationGroup;
}());
exports.NavigationGroup = NavigationGroup;
