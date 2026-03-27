import { ContainerConfig, Container } from '../Container';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link BufferingOverlay} component.
 *
 * @category Configs
 */
export interface BufferingOverlayConfig extends ContainerConfig {
    /**
     * Delay in milliseconds after which the buffering overlay will be displayed. Useful to bypass short stalls without
     * displaying the overlay. Set to 0 to display the overlay instantly.
     * Default: 1000ms (1 second)
     */
    showDelayMs?: number;
}
/**
 * Overlays the player and displays a buffering indicator.
 *
 * @category Components
 */
export declare class BufferingOverlay extends Container<BufferingOverlayConfig> {
    private indicators;
    constructor(config?: BufferingOverlayConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
