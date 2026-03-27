import { Container, ContainerConfig } from '../Container';
import { SettingsPanelItem, SettingsPanelItemConfig } from './SettingsPanelItem';
import { UIInstanceManager } from '../../UIManager';
import { Event, NoArgs } from '../../EventDispatcher';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for a {@link SettingsPanelPage}
 *
 * @category Configs
 */
export interface SettingsPanelPageConfig extends ContainerConfig {
    /**
     * If the page should be removed from the DOM when it is popped from the navigation stack.
     */
    removeOnPop?: Boolean;
}
/**
 * A panel containing a list of {@link SettingsPanelItem items} that represent labelled settings.
 *
 * @category Components
 */
export declare class SettingsPanelPage extends Container<SettingsPanelPageConfig> {
    private static readonly CLASS_LAST;
    private settingsPanelPageEvents;
    constructor(config: SettingsPanelPageConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    hasActiveSettings(): boolean;
    getItems(): SettingsPanelItem<SettingsPanelItemConfig>[];
    onSettingsStateChangedEvent(): void;
    get onSettingsStateChanged(): Event<SettingsPanelPage, NoArgs>;
    onActiveEvent(): void;
    get onActive(): Event<SettingsPanelPage, NoArgs>;
    onInactiveEvent(): void;
    get onInactive(): Event<SettingsPanelPage, NoArgs>;
    /**
     * Dynamically add a settings panel item to the page.
     */
    addSettingsPanelItem(settingsPanelItem: SettingsPanelItem<SettingsPanelItemConfig>): void;
    /**
     * Dynamically remove a settings panel item from the page.
     */
    removeSettingsPanelItem(settingsPanelItem: SettingsPanelItem<SettingsPanelItemConfig>): void;
}
