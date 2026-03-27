import { ToggleButton, ToggleButtonConfig } from './ToggleButton';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * @category Buttons
 */
export declare class EcoModeToggleButton extends ToggleButton<ToggleButtonConfig> {
    private adaptationConfig;
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private areAdaptationApisAvailable;
    enableEcoMode(player: PlayerAPI): void;
    disableEcoMode(player: PlayerAPI): void;
}
