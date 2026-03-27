import { ClickOverlay, ClickOverlayConfig } from './overlays/ClickOverlay';
/**
 * Configuration interface for a {@link ClickOverlay}.
 *
 * @category Configs
 */
export interface WatermarkConfig extends ClickOverlayConfig {
}
/**
 * A watermark overlay with a clickable logo.
 *
 * @category Components
 */
export declare class Watermark extends ClickOverlay {
    constructor(config?: WatermarkConfig);
}
