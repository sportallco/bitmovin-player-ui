import { ToggleButton, ToggleButtonConfig } from './ToggleButton';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * @category Configs
 */
export interface PlaybackToggleButtonConfig extends ToggleButtonConfig {
    /**
     * Specify whether the player should be set to enter fullscreen by clicking on the playback toggle button
     * when initiating the initial playback.
     * Default is false.
     */
    enterFullscreenOnInitialPlayback?: boolean;
}
/**
 * A button that toggles between playback and pause.
 *
 * @category Buttons
 */
export declare class PlaybackToggleButton extends ToggleButton<PlaybackToggleButtonConfig> {
    private static readonly CLASS_STOPTOGGLE;
    protected isPlayInitiated: boolean;
    constructor(config?: PlaybackToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager, handleClickEvent?: boolean): void;
}
