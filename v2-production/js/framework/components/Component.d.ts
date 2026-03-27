import { DOM } from '../DOM';
import { NoArgs, Event } from '../EventDispatcher';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../localization/i18n';
/**
 * Base configuration interface for a component.
 * Should be extended by components that want to add additional configuration options.
 *
 * @category Configs
 */
export interface ComponentConfig {
    /**
     * The HTML tag name of the component.
     * Default: 'div'
     */
    tag?: string;
    /**
     * The HTML ID of the component.
     * Default: automatically generated with pattern 'ui-id-{guid}'.
     */
    id?: string;
    /**
     * A prefix to prepend all CSS classes with.
     */
    cssPrefix?: string;
    /**
     * The CSS classes of the component. This is usually the class from where the component takes its styling.
     */
    cssClass?: string;
    /**
     * Additional CSS classes of the component.
     */
    cssClasses?: string[];
    /**
     * Specifies if the component should be hidden at startup.
     * Default: false
     */
    hidden?: boolean;
    /**
     * Specifies if the component is enabled (interactive) or not.
     * Default: false
     */
    disabled?: boolean;
    /**
     * Specifies the component role for WCAG20 standard
     */
    role?: string;
    /**
     * WCAG20 requirement for screen reader navigation
     */
    tabIndex?: number;
    /**
     * WCAG20 standard for defining info about the component (usually the name)
     */
    ariaLabel?: LocalizableText;
}
export interface ComponentHoverChangedEventArgs extends NoArgs {
    /**
     * True is the component is hovered, else false.
     */
    hovered: boolean;
}
export declare enum ViewMode {
    /**
     * Indicates that the component has entered a view mode where it must stay visible. Auto-hiding of this component
     * must be disabled as long as it resides in this state.
     */
    Persistent = "persistent",
    /**
     * The control can be hidden at any time.
     */
    Temporary = "temporary"
}
export interface ViewModeChangedEventArgs extends NoArgs {
    /**
     * The `ViewMode` the control is currently in.
     */
    mode: ViewMode;
}
export interface ComponentFocusChangedEventArgs extends NoArgs {
    /**
     * True is the component is focused, else false.
     */
    focused: boolean;
}
/**
 * The base class of the UI framework.
 * Each component must extend this class and optionally the config interface.
 *
 * @category Components
 */
export declare class Component<Config extends ComponentConfig> {
    /**
     * The classname that is attached to the element when it is in the hidden state.
     * @type {string}
     */
    private static readonly CLASS_HIDDEN;
    /**
     * The classname that is attached to the element when it is in the disabled state.
     * @type {string}
     */
    private static readonly CLASS_DISABLED;
    /**
     * Stable handler reference for language change events, delegates to the overridable
     * {@link #onLanguageChanged} method. Using a private arrow field ensures that
     * subscribe/unsubscribe always use the same reference, even when subclasses override
     * {@link #onLanguageChanged}.
     */
    private readonly languageChangedHandler;
    /**
     * Configuration object of this component.
     */
    protected config: Config;
    /**
     * The component's DOM element.
     */
    private element;
    /**
     * Flag that keeps track of the hidden state.
     */
    private hidden;
    /**
     * Flat that keeps track of the disabled state.
     */
    private disabled;
    /**
     * Flag that keeps track of the hover state.
     */
    private hovered;
    /**
     * The current view mode of the component.
     */
    private viewMode;
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
    private componentEvents;
    /**
     * Constructs a component with an optionally supplied config. All subclasses must call the constructor of their
     * superclass and then merge their configuration into the component's configuration.
     * @param config the configuration for the component
     */
    constructor(config?: ComponentConfig);
    /**
     * Initializes the component, e.g. by applying config settings.
     * This method must not be called from outside the UI framework.
     *
     * This method is automatically called by the {@link UIInstanceManager}. If the component is an inner component of
     * some component, and thus encapsulated abd managed internally and never directly exposed to the UIManager,
     * this method must be called from the managing component's {@link #initialize} method.
     */
    initialize(): void;
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
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Releases all resources and dependencies that the component holds. Player, DOM, and UIManager events are
     * automatically removed during release and do not explicitly need to be removed here.
     * This method is called by the UIManager when it releases the UI.
     *
     * Subclasses that need to release resources should override this method and call super.release().
     */
    release(): void;
    /**
     * Called when the UI language changes. Subclasses can override this method to update
     * their localized content (e.g. labels, button text).
     *
     * The base implementation is a no-op.
     */
    protected onLanguageChanged(): void;
    /**
     * Generate the DOM element for this component.
     *
     * Subclasses usually overwrite this method to extend or replace the DOM element with their own design.
     */
    protected toDomElement(): DOM;
    /**
     * Returns the DOM element of this component. Creates the DOM element if it does not yet exist.
     *
     * Should not be overwritten by subclasses.
     *
     * @returns {DOM}
     */
    getDomElement(): DOM;
    /**
     * Checks if this component has a DOM element.
     */
    hasDomElement(): boolean;
    setAriaLabel(label: LocalizableText): void;
    setAriaAttr(name: string, value: string): void;
    /**
     * Merges a configuration with a default configuration and a base configuration from the superclass.
     *
     * @param config the configuration settings for the components, as usually passed to the constructor
     * @param defaults a default configuration for settings that are not passed with the configuration
     * @param base configuration inherited from a superclass
     * @returns {Config}
     */
    protected mergeConfig<Config>(config: Config, defaults: Partial<Config>, base: Config): Config;
    /**
     * Helper method that returns a string of all CSS classes of the component.
     *
     * @returns {string}
     */
    protected getCssClasses(): string;
    protected prefixCss(cssClassOrId: string): string;
    /**
     * Returns the configuration object of the component.
     * @returns {Config}
     */
    getConfig(): Config;
    /**
     * Hides the component if shown.
     * This method basically transfers the component into the hidden state. Actual hiding is done via CSS.
     */
    hide(): void;
    /**
     * Shows the component if hidden.
     */
    show(): void;
    /**
     * Determines if the component is hidden.
     * @returns {boolean} true if the component is hidden, else false
     */
    isHidden(): boolean;
    /**
     * Determines if the component is shown.
     * @returns {boolean} true if the component is visible, else false
     */
    isShown(): boolean;
    /**
     * Toggles the hidden state by hiding the component if it is shown, or showing it if hidden.
     */
    toggleHidden(): void;
    /**
     * Disables the component.
     * This method basically transfers the component into the disabled state. Actual disabling is done via CSS or child
     * components. (e.g. Button needs to unsubscribe click listeners)
     */
    disable(): void;
    /**
     * Enables the component.
     * This method basically transfers the component into the enabled state. Actual enabling is done via CSS or child
     * components. (e.g. Button needs to subscribe click listeners)
     */
    enable(): void;
    /**
     * Determines if the component is disabled.
     * @returns {boolean} true if the component is disabled, else false
     */
    isDisabled(): boolean;
    /**
     * Determines if the component is enabled.
     * @returns {boolean} true if the component is enabled, else false
     */
    isEnabled(): boolean;
    /**
     * Determines if the component is currently hovered.
     * @returns {boolean} true if the component is hovered, else false
     */
    isHovered(): boolean;
    /**
     * Fires the onShow event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onShowEvent(): void;
    /**
     * Fires the onHide event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onHideEvent(): void;
    /**
     * Fires the onEnabled event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onEnabledEvent(): void;
    /**
     * Fires the onDisabled event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onDisabledEvent(): void;
    /**
     * Fires the onViewModeChanged event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onViewModeChangedEvent(mode: ViewMode): void;
    /**
     * Fires the onHoverChanged event.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     */
    protected onHoverChangedEvent(hovered: boolean): void;
    protected onFocusChangedEvent(focused: boolean): void;
    /**
     * Gets the event that is fired when the component is showing.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     * @returns {Event<Component<Config>, NoArgs>}
     */
    get onShow(): Event<Component<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the component is hiding.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     * @returns {Event<Component<Config>, NoArgs>}
     */
    get onHide(): Event<Component<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the component is enabling.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     * @returns {Event<Component<Config>, NoArgs>}
     */
    get onEnabled(): Event<Component<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the component is disabling.
     * See the detailed explanation on event architecture on the {@link #componentEvents events list}.
     * @returns {Event<Component<Config>, NoArgs>}
     */
    get onDisabled(): Event<Component<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the component's hover-state is changing.
     * @returns {Event<Component<Config>, ComponentHoverChangedEventArgs>}
     */
    get onHoverChanged(): Event<Component<Config>, ComponentHoverChangedEventArgs>;
    /**
     * Gets the event that is fired when the `ViewMode` of this component has changed.
     * @returns {Event<Component<Config>, ViewModeChangedEventArgs>}
     */
    get onViewModeChanged(): Event<Component<Config>, ViewModeChangedEventArgs>;
    /**
     * Gets the event that is fired when the component's focus-state is changing.
     * @returns {Event<Component<Config>, ComponentFocusChangedEventArgs>}
     */
    get onFocusedChanged(): Event<Component<Config>, ComponentFocusChangedEventArgs>;
}
