import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './SubtitleSettingSelectBox';
import { UIInstanceManager } from '../../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different background colors.
 *
 * @category Components
 */
export declare class WindowColorSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
