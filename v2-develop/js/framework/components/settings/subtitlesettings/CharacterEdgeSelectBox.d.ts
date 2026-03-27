import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './SubtitleSettingSelectBox';
import { UIInstanceManager } from '../../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different character edge.
 *
 * @category Components
 */
export declare class CharacterEdgeSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
