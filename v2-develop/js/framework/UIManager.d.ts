import { UIContainer } from './components/UIContainer';
import { DOM } from './DOM';
import { Component, ComponentConfig, ViewModeChangedEventArgs } from './components/Component';
import { SeekBar, SeekBarMarker } from './components/seekbar/SeekBar';
import { NoArgs, EventDispatcher, CancelEventArgs } from './EventDispatcher';
import { TimelineMarker, UIConfig } from './UIConfig';
import { PlayerAPI, PlayerEvent } from 'bitmovin-player';
import { VolumeController } from './utils/VolumeController';
import { CustomVocabulary, Vocabularies, I18n, LanguageChangedArgument } from './localization/i18n';
import { SpatialNavigation } from './spatialnavigation/SpatialNavigation';
import { SubtitleSettingsManager } from './utils/SubtitleSettingsManager';
import { BufferingOverlay } from './components/overlays/BufferingOverlay';
import { AdBreakTracker } from './utils/AdBreakTracker';
/**
 * @category Configs
 */
export interface LocalizationConfig {
    /**
     * Sets the desired language, and falls back to 'en' if there is no vocabulary for the desired language. Setting it
     * to "auto" will enable language detection from the browser's locale.
     */
    language?: 'auto' | 'en' | 'de' | string;
    /**
     * A map of `language` to {@link CustomVocabulary} definitions. Can be used to overwrite default translations and add
     * custom strings or additional languages.
     */
    vocabularies?: Vocabularies;
    events?: {
        /**
         * Fires when the UI language has been changed during the lifetime of the UI.
         */
        onLanguageChanged: EventDispatcher<I18n, LanguageChangedArgument>;
    };
    /**
     * Specifies if the UI localization should automatically adapt to the selected subtitle language.
     * When enabled, the UI language will change to match the subtitle track's language, falling back
     * to the configured default UI language (English unless configured otherwise) if the language is not available.
     *
     * Default: false
     */
    adaptLocalizationToSubtitleLanguage?: boolean;
}
/**
 * @category Configs
 */
export interface InternalUIConfig extends UIConfig {
    events: {
        /**
         * Fires when the configuration has been updated/changed.
         */
        onUpdated: EventDispatcher<UIManager, void>;
    };
    volumeController: VolumeController;
    adBreakTracker: AdBreakTracker;
}
/**
 * The context that will be passed to a {@link UIConditionResolver} to determine if it's conditions fulfil the context.
 */
export interface UIConditionContext {
    /**
     * Tells if the player is loading or playing an ad.
     */
    isAd: boolean;
    /**
     * Tells if the current ad requires an external UI, if {@link #isAd} is true.
     */
    adRequiresUi: boolean;
    /**
     * Tells if the player is currently in fullscreen mode.
     */
    isFullscreen: boolean;
    /**
     * Tells if the UI is running in a mobile browser.
     */
    isMobile: boolean;
    /**
     * Tells if the UI is running in a TV browser.
     */
    isTv: boolean;
    /**
     * Tells if the player is in playing or paused state.
     */
    isPlaying: boolean;
    /**
     * Tells if the player has a Source.
     */
    isSourceLoaded: boolean;
    /**
     * The width of the player/UI element.
     */
    width: number;
    /**
     * The width of the document where the player/UI is embedded in.
     */
    documentWidth: number;
}
/**
 * Resolves the conditions of its associated UI in a {@link UIVariant} upon a {@link UIConditionContext} and decides
 * if the UI should be displayed. If it returns true, the UI is a candidate for display; if it returns false, it will
 * not be displayed in the given context.
 */
export interface UIConditionResolver {
    (context: UIConditionContext): boolean;
}
/**
 * Associates a UI instance with an optional {@link UIConditionResolver} that determines if the UI should be displayed.
 */
export interface UIVariant {
    ui: UIContainer;
    condition?: UIConditionResolver;
    spatialNavigation?: SpatialNavigation;
}
export interface ActiveUiChangedArgs extends NoArgs {
    /**
     * The previously active {@link UIInstanceManager} prior to the {@link UIManager} switching to a different UI variant.
     */
    previousUi: UIInstanceManager;
    /**
     * The currently active {@link UIInstanceManager}.
     */
    currentUi: UIInstanceManager;
}
export declare class UIManager {
    private player;
    private uiContainerElement;
    private uiVariants;
    private uiInstanceManagers;
    private currentUi;
    private config;
    private managerPlayerWrapper;
    private focusVisibilityTracker;
    private subtitleSettingsManager;
    private shadowDomManager;
    private events;
    /**
     * Creates a UI manager with a single UI variant that will be permanently shown.
     * @param player the associated player of this UI
     * @param ui the UI to add to the player
     * @param uiconfig optional UI configuration
     */
    constructor(player: PlayerAPI, ui: UIContainer, uiconfig?: UIConfig);
    /**
     * Creates a UI manager with a list of UI variants that will be dynamically selected and switched according to
     * the context of the UI.
     *
     * Every time the UI context changes, the conditions of the UI variants will be sequentially resolved and the first
     * UI, whose condition evaluates to true, will be selected and displayed. The last variant in the list might omit the
     * condition resolver and will be selected as default/fallback UI when all other conditions fail. If there is no
     * fallback UI and all conditions fail, no UI will be displayed.
     *
     * @param player the associated player of this UI
     * @param uiVariants a list of UI variants that will be dynamically switched
     * @param uiconfig optional UI configuration
     */
    constructor(player: PlayerAPI, uiVariants: UIVariant[], uiconfig?: UIConfig);
    /**
     * Exposes i18n.getLocalizer() function
     * @returns {I18nApi.getLocalizer()}
     */
    static localize<V extends CustomVocabulary<Record<string, string>>>(key: keyof V): import("./localization/i18n").Localizer;
    /**
     * Provide configuration to support Custom UI languages
     * default language: 'en'
     */
    static setLocalizationConfig(localizationConfig: LocalizationConfig): void;
    getSubtitleSettingsManager(): SubtitleSettingsManager;
    getConfig(): UIConfig;
    /**
     * Returns the list of UI variants as passed into the constructor of {@link UIManager}.
     * @returns {UIVariant[]} the list of available UI variants
     */
    getUiVariants(): UIVariant[];
    /**
     * Switches to a UI variant from the list returned by {@link getUiVariants}.
     * @param {UIVariant} uiVariant the UI variant to switch to
     * @param {() => void} onShow a callback that is executed just before the new UI variant is shown
     */
    switchToUiVariant(uiVariant: UIVariant, onShow?: () => void): void;
    /**
     * Triggers a UI variant switch as triggered by events when automatic switching is enabled. It allows to overwrite
     * properties of the {@link UIConditionContext}.
     * @param {Partial<UIConditionContext>} context an optional set of properties that overwrite properties of the
     *   automatically determined context
     * @param {(context: UIConditionContext) => void} onShow a callback that is executed just before the new UI variant
     *   is shown (if a switch is happening)
     */
    resolveUiVariant(context?: Partial<UIConditionContext>, onShow?: (context: UIConditionContext) => void): void;
    /**
     * The node the UI renders into. When Shadow DOM is enabled, this wraps the ShadowRoot; otherwise it wraps the
     * provided `UIConfig.container` (or the `player.container`).
     */
    get uiWrapperElement(): DOM;
    private addUi;
    private releaseUi;
    release(): void;
    /**
     * Fires just before UI variants are about to be resolved and the UI variant is possibly switched. It is fired when
     * the switch is triggered from an automatic switch and when calling {@link resolveUiVariant}.
     * Can be used to modify the {@link UIConditionContext} before resolving is done.
     * @returns {EventDispatcher<UIManager, UIConditionContext>}
     */
    get onUiVariantResolve(): EventDispatcher<UIManager, UIConditionContext>;
    /**
     * Fires after the UIManager has switched to a different UI variant.
     * @returns {EventDispatcher<UIManager, ActiveUiChangedArgs>}
     */
    get onActiveUiChanged(): EventDispatcher<UIManager, ActiveUiChangedArgs>;
    /**
     * The current active {@link UIInstanceManager}.
     */
    get activeUi(): UIInstanceManager;
    /**
     * Returns the list of all added markers in undefined order.
     */
    getTimelineMarkers(): TimelineMarker[];
    /**
     * Adds a marker to the timeline. Does not check for duplicates/overlaps at the `time`.
     */
    addTimelineMarker(timelineMarker: TimelineMarker): void;
    /**
     * Removes a marker from the timeline (by reference) and returns `true` if the marker has
     * been part of the timeline and successfully removed, or `false` if the marker could not
     * be found and thus not removed.
     */
    removeTimelineMarker(timelineMarker: TimelineMarker): boolean;
}
export interface SeekPreviewArgs extends NoArgs {
    /**
     * The timeline position in percent where the event originates from.
     */
    position: number;
    /**
     * The timeline marker associated with the current position, if existing.
     */
    marker?: SeekBarMarker;
}
/**
 * Encapsulates functionality to manage a UI instance. Used by the {@link UIManager} to manage multiple UI instances.
 */
export declare class UIInstanceManager {
    private playerWrapper;
    private ui;
    private config;
    private subtitleSettingsManager;
    protected spatialNavigation?: SpatialNavigation;
    readonly uiWrapperElement: DOM;
    private events;
    constructor(player: PlayerAPI, ui: UIContainer, config: InternalUIConfig, subtitleSettingsManager: SubtitleSettingsManager, uiWrapperElement: DOM, spatialNavigation?: SpatialNavigation);
    getSubtitleSettingsManager(): SubtitleSettingsManager;
    getConfig(): InternalUIConfig;
    getUI(): UIContainer;
    getPlayer(): PlayerAPI;
    /**
     * Fires when the UI is fully configured and added to the DOM.
     * @returns {EventDispatcher}
     */
    get onConfigured(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires when a seek starts.
     * @returns {EventDispatcher}
     */
    get onSeek(): EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when the seek timeline is scrubbed.
     * @returns {EventDispatcher}
     */
    get onSeekPreview(): EventDispatcher<SeekBar, SeekPreviewArgs>;
    /**
     * Fires when a seek is finished.
     * @returns {EventDispatcher}
     */
    get onSeeked(): EventDispatcher<SeekBar, NoArgs>;
    /**
     * Fires when a component is showing.
     * @returns {EventDispatcher}
     */
    get onComponentShow(): EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when a component is hiding.
     * @returns {EventDispatcher}
     */
    get onComponentHide(): EventDispatcher<Component<ComponentConfig>, NoArgs>;
    /**
     * Fires when the UI controls are showing.
     * @returns {EventDispatcher}
     */
    get onControlsShow(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires before the UI controls are hiding to check if they are allowed to hide.
     * @returns {EventDispatcher}
     */
    get onPreviewControlsHide(): EventDispatcher<UIContainer, CancelEventArgs>;
    /**
     * Fires when the UI controls are hiding.
     * @returns {EventDispatcher}
     */
    get onControlsHide(): EventDispatcher<UIContainer, NoArgs>;
    /**
     * Fires when the BufferingOverlay shows.
     * @returns {EventDispatcher}
     */
    get onBufferingShow(): EventDispatcher<BufferingOverlay, NoArgs>;
    /**
     * Fires when the BufferingOverlay hides.
     * @returns {EventDispatcher}
     */
    get onBufferingHide(): EventDispatcher<BufferingOverlay, NoArgs>;
    /**
     * Fires when the UI controls are released.
     * @returns {EventDispatcher}
     */
    get onRelease(): EventDispatcher<UIContainer, NoArgs>;
    get onComponentViewModeChanged(): EventDispatcher<Component<ComponentConfig>, ViewModeChangedEventArgs>;
    protected clearEventHandlers(): void;
}
/**
 * Extended interface of the {@link Player} for use in the UI.
 */
export interface WrappedPlayer extends PlayerAPI {
    /**
     * Fires an event on the player that targets all handlers in the UI but never enters the real player.
     * @param event the event to fire
     * @param data data to send with the event
     */
    fireEventInUI(event: PlayerEvent, data: {}): void;
}
/**
 * Wraps the player to track event handlers and provide a simple method to remove all registered event
 * handlers from the player.
 *
 * @category Utils
 */
export declare class PlayerWrapper {
    private player;
    private wrapper;
    private eventHandlers;
    constructor(player: PlayerAPI);
    /**
     * Returns a wrapped player object that can be used on place of the normal player object.
     * @returns {WrappedPlayer} a wrapped player
     */
    getPlayer(): WrappedPlayer;
    /**
     * Clears all registered event handlers from the player that were added through the wrapped player.
     */
    clearEventHandlers(): void;
}
