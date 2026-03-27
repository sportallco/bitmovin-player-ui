import { LocalizableText } from '../../localization/i18n';
import { UIInstanceManager } from '../../UIManager';
import { LabelConfig, Label } from '../labels/Label';
import { PlayerAPI } from 'bitmovin-player';
export interface AdCounterLabelConfig extends LabelConfig {
    /**
     * Message displayed during the ad indicating which ad out of how many in the current ad break is currently playing.
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
    private updateLabelText;
    constructor(config?: AdCounterLabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected onLanguageChanged(): void;
}
