import { SelectBox } from './SelectBox';
import { ListSelectorConfig } from '../lists/ListSelector';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different playback speeds.
 *
 * @category Components
 */
export declare class PlaybackSpeedSelectBox extends SelectBox {
    protected defaultPlaybackSpeeds: number[];
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    setSpeed(speed: number): void;
    addDefaultItems(customItems?: number[]): void;
    clearItems(): void;
}
