import { ListSelector, ListSelectorConfig } from './ListSelector';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
import { SettingsPanel, SettingsPanelConfig } from '../settings/SettingsPanel';
import { LocalizableText } from '../../localization/i18n';
export interface ListBoxConfig extends SettingsPanelConfig, ListSelectorConfig {
    /**
     * The list selector component which will be used to build the settings page.
     */
    listSelector: ListSelector<ListSelectorConfig>;
    /**
     * An optional title which will be added to the list.
     */
    title?: LocalizableText;
}
export declare class ListBox extends SettingsPanel<ListBoxConfig> {
    private readonly settingsPanelPage;
    private readonly listSelector;
    constructor(config: ListBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
