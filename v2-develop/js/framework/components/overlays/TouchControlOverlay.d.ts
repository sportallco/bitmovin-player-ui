import { Container, ContainerConfig } from '../Container';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
import { NoArgs, Event as EDEvent } from '../../EventDispatcher';
export interface TouchControlOverlayConfig extends ContainerConfig {
    /**
     * Specify whether the player should be set to enter fullscreen by clicking on the playback toggle button
     * when initiating the initial playback.
     * Default: false.
     */
    enterFullscreenOnInitialPlayback?: boolean;
    /**
     * Specifies whether the first touch event received by the {@link UIContainer} should be prevented or not.
     *
     * Default: true
     */
    acceptsTouchWithUiHidden?: boolean;
    /**
     * Specifies how many seconds are seeked incase user seeks through double-tapping
     * Default: 10sec
     */
    seekTime?: number;
    /**
     * The second tap of a double tap has to be in a specific range of the first tap
     * This specifies how many pixels off the second tap is allowed to be from the first tap
     * in order to trigger the seek events
     *
     * Default: 15px
     */
    seekDoubleTapMargin?: number;
    /**
     * Time in milliseconds within which two consecutive taps are considered a double tap.
     * Default: 200ms
     */
    seekDoubleTapTimeout?: number;
}
/**
 * Overlays the player and detects touch input
 */
export declare class TouchControlOverlay extends Container<TouchControlOverlayConfig> {
    private readonly SEEK_FORWARD_CLASS;
    private readonly SEEK_BACKWARD_CLASS;
    private touchControlEvents;
    private playbackToggleButton;
    private seekForwardLabel;
    private seekBackwardLabel;
    private quickSeekBackwardButton;
    private quickSeekForwardButton;
    private readonly CONTROLS_HIDDEN_CLASS;
    private couldBeDoubleTapping;
    private doubleTapTimeout;
    private latestTapPosition;
    constructor(config?: TouchControlOverlayConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private hideSeekAnimationElements;
    protected onDoubleClickEvent(e: Event): void;
    protected onSingleClickEvent(e: Event): void;
    get onClick(): EDEvent<TouchControlOverlay, NoArgs>;
}
