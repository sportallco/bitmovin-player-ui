import { ContainerConfig, Container } from './Container';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link ControlBar}.
 *
 * @category Configs
 */
export interface ControlBarConfig extends ContainerConfig {
}
/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 *
 * @category Components
 */
export declare class ControlBar extends Container<ControlBarConfig> {
    constructor(config: ControlBarConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
