import { Container, ContainerConfig } from '../Container';
/**
 * @category Configs
 */
export interface PlaybackToggleOverlayConfig extends ContainerConfig {
    /**
     * Specify whether the player should be set to enter fullscreen by clicking on the playback toggle button
     * when initiating the initial playback.
     * Default is false.
     */
    enterFullscreenOnInitialPlayback?: boolean;
}
/**
 * Overlays the player and displays error messages.
 *
 * @category Components
 */
export declare class PlaybackToggleOverlay extends Container<PlaybackToggleOverlayConfig> {
    private playbackToggleButton;
    constructor(config?: PlaybackToggleOverlayConfig);
}
