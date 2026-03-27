import { Label, LabelConfig } from '../labels/Label';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
/**
 * A label that displays a message about a running ad, optionally with a countdown.
 *
 * The message text supports placeholders that are dynamically replaced with ad timing information:
 * - `{remainingTime[formatString]}` - Remaining time until the ad ends
 * - `{playedTime[formatString]}` - Current playback time of the ad
 * - `{adDuration[formatString]}` - Total duration of the current ad
 * - `{adBreakRemainingTime[formatString]}` - Remaining time for the entire ad break (including all remaining ads)
 *
 * Format string options (optional):
 * - `%d` - Integer (e.g., `{remainingTime%d}` → `100`)
 * - `%0Nd` - Integer with N leading zeros (e.g., `{remainingTime%03d}` → `100`)
 * - `%f` - Float (e.g., `{remainingTime%f}` → `100.0`)
 * - `%0Nf` - Float with leading zeros (e.g., `{remainingTime%05f}` → `100.0`)
 * - `%.Mf` - Float with M decimal places (e.g., `{remainingTime%.2f}` → `100.00`)
 * - `%hh:mm:ss` - Time format with hours (e.g., `{remainingTime%hh:mm:ss}` → `00:01:40`)
 * - `%mm:ss` - Time format without hours (e.g., `{remainingTime%mm:ss}` → `01:40`)
 *
 * Example: `{ text: 'Ad: {remainingTime%mm:ss}' }` displays "Ad: 01:40" for 100 seconds remaining.
 *
 * Note: If a LinearAd has a `uiConfig.message` property, it takes precedence over the configured `text`.
 *
 * @category Labels
 */
export declare class AdMessageLabel extends Label<LabelConfig> {
    constructor(config?: LabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
