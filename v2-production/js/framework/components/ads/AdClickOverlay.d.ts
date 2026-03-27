import { ClickOverlay, ClickOverlayConfig } from '../overlays/ClickOverlay';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A simple click capture overlay for clickThroughUrls of ads.
 *
 * @category Components
 */
export declare class AdClickOverlay extends ClickOverlay {
    constructor(config?: ClickOverlayConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
