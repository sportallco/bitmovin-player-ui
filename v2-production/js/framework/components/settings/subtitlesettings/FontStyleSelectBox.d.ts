import { PlayerAPI } from 'bitmovin-player';
import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './SubtitleSettingSelectBox';
import { UIInstanceManager } from '../../../UIManager';
/**
 * A select box providing a selection of different font styles.
 *
 * @category Components
 */
export declare class FontStyleSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private initFromSettings;
}
