import { SelectBox } from './SelectBox';
import { ListSelectorConfig } from '../lists/ListSelector';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection between available subtitle and caption tracks.
 *
 * @category Components
 */
export declare class SubtitleSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
