import { SubtitleOverlay } from '../../overlays/SubtitleOverlay';
import { ListSelectorConfig } from '../../lists/ListSelector';
import { SelectBox } from '../SelectBox';
import { SubtitleSettingsManager } from '../../../utils/SubtitleSettingsManager';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../../UIManager';
/**
 * @category Configs
 */
export interface SubtitleSettingSelectBoxConfig extends ListSelectorConfig {
    overlay: SubtitleOverlay;
}
/**
 * Base class for all subtitles settings select box
 *
 * @category Components
 **/
export declare class SubtitleSettingSelectBox extends SelectBox {
    protected settingsManager?: SubtitleSettingsManager;
    readonly overlay: SubtitleOverlay;
    private currentCssClass;
    constructor(config: SubtitleSettingSelectBoxConfig);
    /**
     * Removes a previously set class and adds the passed in class.
     * @param cssClass The new class to replace the previous class with or null to just remove the previous class
     */
    protected toggleOverlayClass(cssClass: string | null): void;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
