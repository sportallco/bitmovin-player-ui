import { Button, ButtonConfig } from '../buttons/Button';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
/**
 * Configuration interface for the {@link AdSkipButton}.
 *
 * @category Configs
 */
export interface AdSkipButtonConfig extends ButtonConfig {
    /**
     * Message which gets displayed during the countdown is active.
     * Supported placeholders: look at {@link StringUtils.replaceAdMessagePlaceholders}
     */
    untilSkippableMessage?: LocalizableText;
    /**
     * Message displayed when the ad is skippable.
     * Supported placeholders: look at {@link StringUtils.replaceAdMessagePlaceholders}
     */
    skippableMessage?: LocalizableText;
}
/**
 * A button that is displayed during ads and can be used to skip the ad.
 *
 * @category Buttons
 */
export declare class AdSkipButton extends Button<AdSkipButtonConfig> {
    private updateSkipMessageHandler?;
    private untilSkippableMessage?;
    private skippableMessage?;
    private skipOffset;
    private player?;
    constructor(config?: AdSkipButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected onLanguageChanged(): void;
    release(): void;
}
