import { Button, ButtonConfig } from './Button';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
/**
 * @category Configs
 */
export interface QuickSeekButtonConfig extends ButtonConfig {
    /**
     * Specify how many seconds the player should seek forward/backwards in the stream.
     * Negative values mean a backwards seek, positive values mean a forward seek.
     *
     * Our UI provides default icons for intervals of 5, 10, 15, 20, 30 and 60 seconds and a fallback icon
     * for other intervals.
     *
     * Default is -10.
     */
    seekSeconds?: number;
}
/**
 * @category Buttons
 */
export declare class QuickSeekButton extends Button<QuickSeekButtonConfig> {
    private currentSeekTarget;
    private player;
    constructor(config?: QuickSeekButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private onSeek;
    private onSeekedOrTimeShifted;
    private onTimeShift;
    release(): void;
}
