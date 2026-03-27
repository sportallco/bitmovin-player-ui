import { LabelConfig, Label } from './Label';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
export declare enum PlaybackTimeLabelMode {
    /**
     * Displays the current time
     */
    CurrentTime = 0,
    /**
     * Displays the duration of the content
     */
    TotalTime = 1,
    /**
     * Displays the current time and the duration of the content
     * Format: ${currentTime} / ${totalTime}
     */
    CurrentAndTotalTime = 2,
    /**
     * Displays the remaining time of the content
     */
    RemainingTime = 3
}
/**
 * @category Configs
 */
export interface PlaybackTimeLabelConfig extends LabelConfig {
    /**
     * The type of which time should be displayed in the label.
     * Default: PlaybackTimeLabelMode.CurrentAndTotalTime
     */
    timeLabelMode?: PlaybackTimeLabelMode;
    /**
     * Boolean if the label should be hidden in live playback
     */
    hideInLivePlayback?: boolean;
}
/**
 * A label that display the current playback time and the total time through {@link PlaybackTimeLabel#setTime setTime}
 * or any string through {@link PlaybackTimeLabel#setText setText}.
 *
 * @category Labels
 */
export declare class PlaybackTimeLabel extends Label<PlaybackTimeLabelConfig> {
    private timeFormat;
    constructor(config?: PlaybackTimeLabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Sets the current playback time and total duration.
     * @param playbackSeconds the current playback time in seconds
     * @param durationSeconds the total duration in seconds
     */
    setTime(playbackSeconds: number, durationSeconds: number): void;
    /**
     * Sets the current time format
     * @param timeFormat the time format
     */
    protected setTimeFormat(timeFormat: string): void;
}
