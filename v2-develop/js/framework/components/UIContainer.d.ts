import { Container, ContainerConfig } from './Container';
import { UIInstanceManager } from '../UIManager';
import { DOM } from '../DOM';
import { PlayerUtils } from '../utils/PlayerUtils';
import { Event as UiEvent } from '../EventDispatcher';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for a {@link UIContainer}.
 *
 * @category Configs
 */
export interface UIContainerConfig extends ContainerConfig {
    /**
     * The delay in milliseconds after which the control bar will be hidden when there is no user interaction.
     * Set to -1 for the UI to be always shown.
     * Default: 2 seconds (2000)
     */
    hideDelay?: number;
    /**
     * An array of player states in which the UI will not be hidden, no matter what the {@link hideDelay} is.
     */
    hidePlayerStateExceptions?: PlayerUtils.PlayerState[];
    /**
     * The HTML element on which user interaction events (e.g. mouse and touch events) will be tracked to detect
     * interaction with the UI. These basically trigger showing and hiding of the UI.
     * Default: the UI container itself
     */
    userInteractionEventSource?: HTMLElement;
    /**
     * Specify whether the UI should be hidden immediatly if the mouse leaves the userInteractionEventSource.
     * If false or not set it will wait for the hideDelay.
     * Default: true
     */
    hideImmediatelyOnMouseLeave?: boolean;
    /**
     * When true, suspend the UIContainer's hide timer while a SettingsPanel is open,
     * and resume it when the panel closes.
     * Default: true
     */
    deferUiHideWhileSettingsOpen?: boolean;
}
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 *
 * @category Containers
 */
export declare class UIContainer extends Container<UIContainerConfig> {
    private static readonly STATE_PREFIX;
    private static readonly FULLSCREEN;
    private static readonly BUFFERING;
    private static readonly REMOTE_CONTROL;
    private static readonly CONTROLS_SHOWN;
    private static readonly CONTROLS_HIDDEN;
    private uiHideTimeout;
    private playerStateChange;
    private userInteractionEventSource;
    private userInteractionEvents;
    private hidingPrevented;
    hideUi: (force?: boolean) => void;
    showUi: () => void;
    toggleUiShown: () => void;
    constructor(config: UIContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private configureUIShowHide;
    private configurePlayerStates;
    release(): void;
    onPlayerStateChange(): UiEvent<UIContainer, PlayerUtils.PlayerState>;
    protected suspendHideTimeout(): void;
    protected resumeHideTimeout(): void;
    protected toDomElement(): DOM;
}
