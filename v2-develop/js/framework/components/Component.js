"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.ViewMode = void 0;
var Guid_1 = require("../utils/Guid");
var DOM_1 = require("../DOM");
var EventDispatcher_1 = require("../EventDispatcher");
var i18n_1 = require("../localization/i18n");
var ComponentConfigManager_1 = require("../utils/ComponentConfigManager");
var ViewMode;
(function (ViewMode) {
    /**
     * Indicates that the component has entered a view mode where it must stay visible. Auto-hiding of this component
     * must be disabled as long as it resides in this state.
     */
    ViewMode["Persistent"] = "persistent";
    /**
     * The control can be hidden at any time.
     */
    ViewMode["Temporary"] = "temporary";
})(ViewMode || (exports.ViewMode = ViewMode = {}));
/**
 * The base class of the UI framework.
 * Each component must extend this class and optionally the config interface.
 *
 * @category Components
 */
var Component = /** @class */ (function () {
    /**
     * Constructs a component with an optionally supplied config. All subclasses must call the constructor of their
     * superclass and then merge their configuration into the component's configuration.
     *
     * Side effect: while a {@link UIConfig.componentConfigOverrides} construction context is active, matching component
     * overrides are merged into the passed `config` object before subclass constructors continue. This makes
     * constructor-time reads in subclasses see the same component override values that `mergeConfig()` uses for the final
     * config.
     *
     * @param config the configuration for the component
     */
    function Component(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        /**
         * Stable handler reference for language change events, delegates to the overridable
         * {@link #onLanguageChanged} method. Using a private arrow field ensures that
         * subscribe/unsubscribe always use the same reference, even when subclasses override
         * {@link #onLanguageChanged}.
         */
        this.languageChangedHandler = function () { return _this.onLanguageChanged(); };
        /**
         * The list of events that this component offers. These events should always be private and only directly
         * accessed from within the implementing component.
         *
         * Because TypeScript does not support private properties with the same name on different class hierarchy levels
         * (i.e. superclass and subclass cannot contain a private property with the same name), the default naming
         * convention for the event list of a component that should be followed by subclasses is the concatenation of the
         * camel-cased class name + 'Events' (e.g. SubClass extends Component => subClassEvents).
         * See {@link #componentEvents} for an example.
         *
         * Event properties should be named in camel case with an 'on' prefix and in the present tense. Async events may
         * have a start event (when the operation starts) in the present tense, and must have an end event (when the
         * operation ends) in the past tense (or present tense in special cases (e.g. onStart/onStarted or onPlay/onPlaying).
         * See {@link #componentEvents#onShow} for an example.
         *
         * Each event should be accompanied with a protected method named by the convention eventName + 'Event'
         * (e.g. onStartEvent), that actually triggers the event by calling {@link EventDispatcher#dispatch dispatch} and
         * passing a reference to the component as first parameter. Components should always trigger their events with these
         * methods. Implementing this pattern gives subclasses means to directly listen to the events by overriding the
         * method (and saving the overhead of passing a handler to the event dispatcher) and more importantly to trigger
         * these events without having access to the private event list.
         * See {@link #onShow} for an example.
         *
         * To provide external code the possibility to listen to this component's events (subscribe, unsubscribe, etc.),
         * each event should also be accompanied by a public getter function with the same name as the event's property,
         * that returns the {@link Event} obtained from the event dispatcher by calling {@link EventDispatcher#getEvent}.
         * See {@link #onShow} for an example.
         *
         * Full example for an event representing an example action in a example component:
         *
         * <code>
         * // Define an example component class with an example event
         * class ExampleComponent extends Component<ComponentConfig> {
         *
         *     private exampleComponentEvents = {
         *         onExampleAction: new EventDispatcher<ExampleComponent, NoArgs>()
         *     }
         *
         *     // constructor and other stuff...
         *
         *     protected onExampleActionEvent() {
         *        this.exampleComponentEvents.onExampleAction.dispatch(this);
         *    }
         *
         *    get onExampleAction(): Event<ExampleComponent, NoArgs> {
         *        return this.exampleComponentEvents.onExampleAction.getEvent();
         *    }
         * }
         *
         * // Create an instance of the component somewhere
         * var exampleComponentInstance = new ExampleComponent();
         *
         * // Subscribe to the example event on the component
         * exampleComponentInstance.onExampleAction.subscribe(function (sender: ExampleComponent) {
         *     console.log('onExampleAction of ' + sender + ' has fired!');
         * });
         * </code>
         */
        this.componentEvents = {
            onShow: new EventDispatcher_1.EventDispatcher(),
            onHide: new EventDispatcher_1.EventDispatcher(),
            onViewModeChanged: new EventDispatcher_1.EventDispatcher(),
            onHoverChanged: new EventDispatcher_1.EventDispatcher(),
            onEnabled: new EventDispatcher_1.EventDispatcher(),
            onDisabled: new EventDispatcher_1.EventDispatcher(),
            onFocusChanged: new EventDispatcher_1.EventDispatcher(),
        };
        Object.assign(config, ComponentConfigManager_1.ComponentConfigManager.getConfigFor(this.constructor));
        // Create the configuration for this component
        this.config = this.mergeConfig(config, {
            tag: 'div',
            id: 'bmpui-id-' + Guid_1.Guid.next(),
            cssPrefix: 'bmpui',
            cssClass: 'ui-component',
            cssClasses: [],
            hidden: false,
            disabled: false,
            tabIndex: -1,
        }, {});
        this.viewMode = ViewMode.Temporary;
        i18n_1.i18n.getConfig().events.onLanguageChanged.subscribe(this.languageChangedHandler);
    }
    /**
     * Initializes the component, e.g. by applying config settings.
     * This method must not be called from outside the UI framework.
     *
     * This method is automatically called by the {@link UIInstanceManager}. If the component is an inner component of
     * some component, and thus encapsulated abd managed internally and never directly exposed to the UIManager,
     * this method must be called from the managing component's {@link #initialize} method.
     */
    Component.prototype.initialize = function () {
        this.hidden = this.config.hidden;
        this.disabled = this.config.disabled;
        // Hide the component at initialization if it is configured to be hidden
        if (this.isHidden()) {
            this.hidden = false; // Set flag to false for the following hide() call to work (hide() checks the flag)
            this.hide();
        }
        // Disable the component at initialization if it is configured to be disabled
        if (this.isDisabled()) {
            this.disabled = false; // Set flag to false for the following disable() call to work (disable() checks the flag)
            this.disable();
        }
    };
    /**
     * Configures the component for the supplied Player and UIInstanceManager. This is the place where all the magic
     * happens, where components typically subscribe and react to events (on their DOM element, the Player, or the
     * UIInstanceManager), and basically everything that makes them interactive.
     * This method is called only once, when the UIManager initializes the UI.
     *
     * Subclasses usually overwrite this method to add their own functionality.
     *
     * @param player the player which this component controls
     * @param uimanager the UIInstanceManager that manages this component
     */
    Component.prototype.configure = function (player, uimanager) {
        var _this = this;
        this.onShow.subscribe(function () { return uimanager.onComponentShow.dispatch(_this); });
        this.onHide.subscribe(function () { return uimanager.onComponentHide.dispatch(_this); });
        this.onViewModeChanged.subscribe(function (_, args) { return uimanager.onComponentViewModeChanged.dispatch(_this, args); });
        // Track the hovered state of the element
        this.getDomElement().on('mouseenter', function () { return _this.onHoverChangedEvent(true); });
        this.getDomElement().on('mouseleave', function () { return _this.onHoverChangedEvent(false); });
        // Track the focused state of the element
        this.getDomElement().on('focusin', function () { return _this.onFocusChangedEvent(true); });
        this.getDomElement().on('focusout', function () { return _this.onFocusChangedEvent(false); });
    };
    /**
     * Releases all resources and dependencies that the component holds. Player, DOM, and UIManager events are
     * automatically removed during release and do not explicitly need to be removed here.
     * This method is called by the UIManager when it releases the UI.
     *
     * Subclasses that need to release resources should override this method and call super.release().
     */
    Component.prototype.release = function () {
        i18n_1.i18n.getConfig().events.onLanguageChanged.unsubscribe(this.languageChangedHandler);
    };
    /**
     * Called when the UI language changes. Subclasses can override this method to update
     * their localized content (e.g. labels, button text).
     *
     * The base implementation is a no-op.
     */
    Component.prototype.onLanguageChanged = function () {
        // Override in subclasses to react to language changes
    };
    /**
     * Generate the DOM element for this component.
     *
     * Subclasses usually overwrite this method to extend or replace the DOM element with their own design.
     */
    Component.prototype.toDomElement = function () {
        var element = new DOM_1.DOM(this.config.tag, {
            id: this.config.id,
            class: this.getCssClasses(),
            role: this.config.role,
        }, this);
        if (typeof this.config.tabIndex === 'number') {
            element.attr('tabindex', this.config.tabIndex.toString());
        }
        return element;
    };
    /**
     * Returns the DOM element of this component. Creates the DOM element if it does not yet exist.
     *
     * Should not be overwritten by subclasses.
     *
     * @returns {DOM}
     */
    Component.prototype.getDomElement = function () {
        if (!this.element) {
            this.element = this.toDomElement();
        }
        return this.element;
    };
    /**
     * Checks if this component has a DOM element.
     */
    Component.prototype.hasDomElement = function () {
        return Boolean(this.element);
    };
    Component.prototype.setAriaLabel = function (label) {
        this.setAriaAttr('label', i18n_1.i18n.performLocalization(label));
    };
    Component.prototype.setAriaAttr = function (name, value) {
        this.getDomElement().attr("aria-".concat(name), value);
    };
    /**
     * Merges a configuration with a default configuration and a base configuration from the superclass.
     *
     * @param config the configuration settings for the components, as usually passed to the constructor
     * @param defaults a default configuration for settings that are not passed with the configuration
     * @param base configuration inherited from a superclass
     * @returns {Config}
     */
    Component.prototype.mergeConfig = function (config, defaults, base) {
        // Extend default config with supplied config
        var merged = Object.assign({}, base, defaults, config);
        // Return the extended config
        return merged;
    };
    /**
     * Helper method that returns a string of all CSS classes of the component.
     *
     * @returns {string}
     */
    Component.prototype.getCssClasses = function () {
        var _this = this;
        // Merge all CSS classes into single array
        var flattenedArray = [this.config.cssClass].concat(this.config.cssClasses);
        // Prefix classes
        flattenedArray = flattenedArray.map(function (css) {
            return _this.prefixCss(css);
        });
        // Join array values into a string
        var flattenedString = flattenedArray.join(' ');
        // Return trimmed string to prevent whitespace at the end from the join operation
        return flattenedString.trim();
    };
    Component.prototype.prefixCss = function (cssClassOrId) {
        return this.config.cssPrefix + '-' + cssClassOrId;
    };
    /**
     * Returns the configuration object of the component.
     * @returns {Config}
     */
    Component.prototype.getConfig = function () {
        return this.config;
    };
    /**
     * Hides the component if shown.
     * This method basically transfers the component into the hidden state. Actual hiding is done via CSS.
     */
    Component.prototype.hide = function () {
        if (!this.hidden) {
            this.hidden = true;
            this.getDomElement().addClass(this.prefixCss(Component.CLASS_HIDDEN));
            this.onHideEvent();
        }
    };
    /**
     * Shows the component if hidden.
     */
    Component.prototype.show = function () {
        if (this.hidden) {
            this.getDomElement().removeClass(this.prefixCss(Component.CLASS_HIDDEN));
            this.hidden = false;
            this.onShowEvent();
        }
    };
    /**
     * Determines if the component is hidden.
     * @returns {boolean} true if the component is hidden, else false
     */
    Component.prototype.isHidden = function () {
        return this.hidden;
    };
    /**
     * Determines if the component is shown.
     * @returns {boolean} true if the component is visible, else false
     */
    Component.prototype.isShown = function () {
        return !this.isHidden();
    };
    /**
     * Toggles the hidden state by hiding the component if it is shown, or showing it if hidden.
     */
    Component.prototype.toggleHidden = function () {
        if (this.isHidden()) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    /**
     * Disables the component.
     * This method basically transfers the component into the disabled state. Actual disabling is done via CSS or child
     * components. (e.g. Button needs to unsubscribe click listeners)
     */
    Component.prototype.disable = function () {
        if (!this.disabled) {
            this.disabled = true;
            this.getDomElement().addClass(this.prefixCss(Component.CLASS_DISABLED));
            this.onDisabledEvent();
        }
    };
    /**
     * Enables the component.
     * This method basically transfers the component into the enabled state. Actual enabling is done via CSS or child
     * components. (e.g. Button needs to subscribe click listeners)
     */
    Component.prototype.enable = function () {
        if (this.disabled) {
            this.getDomElement().removeClass(this.prefixCss(Component.CLASS_DISABLED));
            this.disabled = false;
            this.onEnabledEvent();
        }
    };
    /**
     * Determines if the component is disabled.
     * @returns {boolean} true if the component is disabled, else false
     */
    Component.prototype.isDisabled = function () {
        return this.disabled;
    };
    /**
     * Determines if the component is enabled.
     * @returns {boolean} true if the component is enabled, else false
     */
    Component.prototype.isEnabled = function () {
        return !this.isDisabled();
    };
    /**
     * Determines if the component is currently hovered.
     * @returns {boolean} true if the component is hovered, else false
     */
    Component.prototype.isHovered = function () {
        return this.hovered;
    };
    /**
     * Fires the onShow event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onShowEvent = function () {
        this.componentEvents.onShow.dispatch(this);
    };
    /**
     * Fires the onHide event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onHideEvent = function () {
        this.componentEvents.onHide.dispatch(this);
    };
    /**
     * Fires the onEnabled event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onEnabledEvent = function () {
        this.componentEvents.onEnabled.dispatch(this);
    };
    /**
     * Fires the onDisabled event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onDisabledEvent = function () {
        this.componentEvents.onDisabled.dispatch(this);
    };
    /**
     * Fires the onViewModeChanged event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onViewModeChangedEvent = function (mode) {
        if (this.viewMode === mode) {
            return;
        }
        this.viewMode = mode;
        this.componentEvents.onViewModeChanged.dispatch(this, { mode: mode });
    };
    /**
     * Fires the onHoverChanged event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    Component.prototype.onHoverChangedEvent = function (hovered) {
        this.hovered = hovered;
        this.componentEvents.onHoverChanged.dispatch(this, { hovered: hovered });
    };
    Component.prototype.onFocusChangedEvent = function (focused) {
        this.componentEvents.onFocusChanged.dispatch(this, { focused: focused });
    };
    Object.defineProperty(Component.prototype, "onShow", {
        /**
         * Gets the event that is fired when the component is showing.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onShow.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onHide", {
        /**
         * Gets the event that is fired when the component is hiding.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onHide.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onEnabled", {
        /**
         * Gets the event that is fired when the component is enabling.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onEnabled.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onDisabled", {
        /**
         * Gets the event that is fired when the component is disabling.
         * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
         * @returns {Event<Component<Config>, NoArgs>}
         */
        get: function () {
            return this.componentEvents.onDisabled.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onHoverChanged", {
        /**
         * Gets the event that is fired when the component's hover-state is changing.
         * @returns {Event<Component<Config>, ComponentHoverChangedEventArgs>}
         */
        get: function () {
            return this.componentEvents.onHoverChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onViewModeChanged", {
        /**
         * Gets the event that is fired when the `ViewMode` of this component has changed.
         * @returns {Event<Component<Config>, ViewModeChangedEventArgs>}
         */
        get: function () {
            return this.componentEvents.onViewModeChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "onFocusedChanged", {
        /**
         * Gets the event that is fired when the component's focus-state is changing.
         * @returns {Event<Component<Config>, ComponentFocusChangedEventArgs>}
         */
        get: function () {
            return this.componentEvents.onFocusChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The classname that is attached to the element when it is in the hidden state.
     * @type {string}
     */
    Component.CLASS_HIDDEN = 'hidden';
    /**
     * The classname that is attached to the element when it is in the disabled state.
     * @type {string}
     */
    Component.CLASS_DISABLED = 'disabled';
    return Component;
}());
exports.Component = Component;
