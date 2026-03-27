import { UIInstanceManager } from '../../../UIManager';
import { Button, ButtonConfig } from '../../buttons/Button';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button that resets all subtitle settings to their defaults.
 *
 * @category Buttons
 */
export declare class SubtitleSettingsResetButton extends Button<ButtonConfig> {
    private settingsManager;
    constructor(config: ButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
