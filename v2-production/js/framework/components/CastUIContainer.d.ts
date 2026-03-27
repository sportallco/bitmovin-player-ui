import { UIContainer, UIContainerConfig } from './UIContainer';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * The base container for Cast receivers that contains all of the UI and takes care that the UI is shown on
 * certain playback events.
 *
 * @category Containers
 */
export declare class CastUIContainer extends UIContainer {
    private castUiHideTimeout;
    constructor(config: UIContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
}
