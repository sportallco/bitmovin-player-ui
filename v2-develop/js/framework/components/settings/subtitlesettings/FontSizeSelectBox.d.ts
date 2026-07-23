import { SubtitleSettingSelectBox, SubtitleSettingSelectBoxConfig } from './SubtitleSettingSelectBox';
import { UIInstanceManager } from '../../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A select box providing a selection of different font sizes.
 *
 * @category Components
 */
export declare class FontSizeSelectBox extends SubtitleSettingSelectBox {
    constructor(config: SubtitleSettingSelectBoxConfig);
    private getFontSizeOptions;
    private populateItemsWithFilter;
    reapplyFilterAndReload(): void;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private initFromSettings;
}
