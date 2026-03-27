import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
import { ListSelector, ListSelectorConfig } from '../lists/ListSelector';
import { SettingsPanelItemConfig } from './SettingsPanelItem';
import { SettingsPanel, SettingsPanelConfig } from './SettingsPanel';
import { InteractiveSettingsPanelItem } from './InteractiveSettingsPanelItem';
import { Component, ComponentConfig } from '../Component';
/**
 * Configuration interface for a {@link DynamicSettingsPanelItem}.
 *
 * @category Configs
 */
export interface DynamicSettingsPanelItemConfig extends SettingsPanelItemConfig {
    /**
     * The label component or the text for the label.
     */
    label: LocalizableText;
    /**
     * Optional back navigation component to be displayed on the right side of the label.
     */
    backNavigationRightComponent?: Component<ComponentConfig>;
    /**
     * The list selector component which will be used to build the sub page.
     */
    settingComponent: ListSelector<ListSelectorConfig>;
    /**
     * The enclosing {@link SettingsPanel} where the sub page will be added.
     */
    container: SettingsPanel<SettingsPanelConfig>;
}
/**
 * A dynamic settings panel item which can build a sub page with the items of a {@link ListSelector}.
 * The page will be dynamically added and removed from the {@link SettingsPanel}.
 *
 * @category Components
 */
export declare class DynamicSettingsPanelItem extends InteractiveSettingsPanelItem<DynamicSettingsPanelItemConfig> {
    private selectedOptionLabel;
    protected backNavigationRightComponent: Component<ComponentConfig>;
    protected settingComponent: ListSelector<ListSelectorConfig>;
    private player;
    private uimanager;
    constructor(config: DynamicSettingsPanelItemConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected onLanguageChanged(): void;
    private handleSelectedItemChanged;
    private buildSubPanelPage;
    displayItemsSubPage(): void;
}
