import { UIInstanceManager } from '../../UIManager';
import { SettingsPanelPageNavigatorButton, SettingsPanelPageNavigatorConfig } from './SettingsPanelPageNavigatorButton';
import { PlayerAPI } from 'bitmovin-player';
/**
 * @category Buttons
 */
export declare class SettingsPanelPageOpenButton extends SettingsPanelPageNavigatorButton {
    constructor(config: SettingsPanelPageNavigatorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
