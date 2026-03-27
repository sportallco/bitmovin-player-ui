import { ControlBar, ControlBarConfig } from '../ControlBar';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
export interface AdControlBarConfig extends ControlBarConfig {
}
/**
 * Contains player control components displayed during ad playback,
 * e.g., play toggle button, seek bar, volume control, fullscreen toggle button.
 *
 * Usage: Pass one or more {@link Container} components via the `components` array.
 * - Containers containing a {@link SeekBar} (directly or nested) are always shown.
 * - Other containers are hidden/shown when controls hide.
 *
 * @example
 * ```typescript
 * new AdControlBar({
 *   components: [
 *     new Container({
 *       components: [
 *         new AdCounterLabel(),
 *         new SeekBar({ label: new SeekBarLabel() }),
 *         new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.RemainingTime }),
 *       ],
 *       cssClasses: ['ad-controlbar-top'],
 *     }),
 *     new Container({
 *       components: [
 *         new PlaybackToggleButton(),
 *         new VolumeToggleButton(),
 *         new Spacer(),
 *         new FullscreenToggleButton(),
 *       ],
 *       cssClasses: ['ad-controlbar-bottom'],
 *     }),
 *   ],
 * })
 * ```
 *
 * @category Components
 */
export declare class AdControlBar extends ControlBar {
    private containersToHide;
    private containersToKeepVisible;
    constructor(config: AdControlBarConfig);
    hide(): void;
    show(): void;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private containsSeekBar;
}
