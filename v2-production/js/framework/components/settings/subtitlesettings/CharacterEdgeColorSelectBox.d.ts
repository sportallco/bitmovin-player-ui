import { PlayerAPI } from 'bitmovin-player';
import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './SubtitleSettingSelectBox';
import { UIInstanceManager } from '../../../UIManager';
/**
 * A select box providing a selection of different character edge colors.
 *
 * @category Components
 */
export declare class CharacterEdgeColorSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private initFromSettings;
}
