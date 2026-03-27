import { Container, ContainerConfig } from '../Container';
import { AdSkipButton } from './AdSkipButton';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
/**
 * An overlay holding the AdSkipButton which is always visible during Ad playback.
 *
 * @category Components
 */
export declare class AdStatusOverlay extends Container<ContainerConfig> {
    readonly adSkipButton: AdSkipButton;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
