import { ButtonConfig, Button } from './Button';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A button to play/replay a video.
 *
 * @category Buttons
 */
export declare class ReplayButton extends Button<ButtonConfig> {
    constructor(config?: ButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
