import { PlaybackToggleButton, PlaybackToggleButtonConfig } from './PlaybackToggleButton';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that overlays the video and toggles between playback and pause.
 *
 * @category Buttons
 */
export declare class HugePlaybackToggleButton extends PlaybackToggleButton {
    constructor(config?: PlaybackToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Enables or disables the play state transition animations of the play button image. Can be used to suppress
     * animations.
     * @param {boolean} enabled true to enable the animations (default), false to disable them
     */
    protected setTransitionAnimationsEnabled(enabled: boolean): void;
}
