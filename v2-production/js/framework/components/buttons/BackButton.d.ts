import { ButtonConfig, Button } from './Button';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
export declare class BackButton extends Button<ButtonConfig> {
    constructor(config?: ButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
