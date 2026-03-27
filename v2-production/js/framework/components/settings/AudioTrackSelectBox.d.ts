import { SelectBox } from './SelectBox';
import { ListSelectorConfig } from '../lists/ListSelector';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 *
 * @category Components
 */
export declare class AudioTrackSelectBox extends SelectBox {
    constructor(config?: ListSelectorConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
