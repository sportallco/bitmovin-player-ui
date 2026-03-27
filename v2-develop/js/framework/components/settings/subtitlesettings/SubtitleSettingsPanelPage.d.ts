import { SettingsPanelPage, SettingsPanelPageConfig } from '../SettingsPanelPage';
import { SettingsPanel, SettingsPanelConfig } from '../SettingsPanel';
import { SubtitleOverlay } from '../../overlays/SubtitleOverlay';
import { UIInstanceManager } from '../../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * @category Configs
 */
export interface SubtitleSettingsPanelPageConfig extends SettingsPanelPageConfig {
    settingsPanel: SettingsPanel<SettingsPanelConfig>;
    overlay: SubtitleOverlay;
    useDynamicSettingsPanelItem?: boolean;
}
/**
 * @category Components
 */
export declare class SubtitleSettingsPanelPage extends SettingsPanelPage {
    private readonly overlay;
    private readonly settingsPanel;
    constructor(config: SubtitleSettingsPanelPageConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private buildSettingsPanelItem;
}
