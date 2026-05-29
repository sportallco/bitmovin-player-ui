import { SelectBox } from './SelectBox';
import { ListSelectorConfig } from '../lists/ListSelector';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection between available subtitle and caption tracks.
 *
 * When a comparator is configured, the built-in "Off" option remains fixed at the top
 * and is not reordered together with the subtitle tracks.
 *
 * @category Components
 */
export declare class SubtitleSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
