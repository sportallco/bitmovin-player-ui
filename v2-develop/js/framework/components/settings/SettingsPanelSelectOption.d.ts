import { SettingsPanelItemConfig } from './SettingsPanelItem';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
import { ListSelector, ListSelectorConfig } from '../lists/ListSelector';
import { InteractiveSettingsPanelItem } from './InteractiveSettingsPanelItem';
/**
 * Configuration interface for a {@link SettingsPanelSelectOption}.
 *
 * @category Configs
 */
export interface SettingsPanelSelectOptionConfig extends SettingsPanelItemConfig {
    /**
     * The setting that will be changed when this option is clicked.
     */
    settingComponent: ListSelector<ListSelectorConfig>;
    /**
     * The value of the setting that will be selected when this option is clicked.
     */
    settingsValue: string | undefined;
}
/**
 * A custom select option for a {@link ListSelector} option.
 * Is used for building dynamic sub pages from a {@link DynamicSettingsPanelItem}.
 *
 * @category Components
 */
export declare class SettingsPanelSelectOption extends InteractiveSettingsPanelItem<SettingsPanelSelectOptionConfig> {
    private settingsValue;
    protected settingComponent: ListSelector<ListSelectorConfig>;
    constructor(config: SettingsPanelSelectOptionConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
