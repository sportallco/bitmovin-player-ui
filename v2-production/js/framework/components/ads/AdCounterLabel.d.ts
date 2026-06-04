import { LocalizableText } from '../../localization/i18n';
import { UIInstanceManager } from '../../UIManager';
import { LabelConfig, Label } from '../labels/Label';
import { PlayerAPI } from 'bitmovin-player';
export interface AdCounterLabelConfig extends LabelConfig {
    /**
     * Message displayed during the ad indicating which ad out of how many is currently playing. It takes all ad breaks
     * with the same schedule time into account.
     * Supported placeholders: look at {@link StringUtils.replaceAdMessagePlaceholders}
     */
    adCountOutOfTotal?: LocalizableText;
}
/**
 * A label that displays the index of the currently playing ad out of the total number of ads.
 *
 * @category Labels
 */
export declare class AdCounterLabel extends Label<AdCounterLabelConfig> {
    private player?;
    private adBreakTracker?;
    constructor(config?: AdCounterLabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
    protected onLanguageChanged(): void;
    private readonly adBreakTrackerAdCountChangedHandler;
    private setAdCounterFromAdBreakTracker;
}
