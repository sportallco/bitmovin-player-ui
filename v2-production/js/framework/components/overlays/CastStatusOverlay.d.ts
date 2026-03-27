import { ContainerConfig, Container } from '../Container';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Overlays the player and displays the status of a Cast session.
 *
 * @category Components
 */
export declare class CastStatusOverlay extends Container<ContainerConfig> {
    private statusLabel;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
