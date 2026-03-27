import { Container, ContainerConfig } from '../Container';
import { Component, ComponentConfig } from '../Component';
import { Event, NoArgs } from '../../EventDispatcher';
import { LabelStyle } from '../labels/Label';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
/**
 * Configuration interface for a {@link SettingsPanelItem}
 *
 * @category Configs
 */
export interface SettingsPanelItemConfig extends ContainerConfig {
    /**
     * The label component or the text for the label.
     */
    label?: LocalizableText | Component<ComponentConfig>;
    /**
     * The style of the label in case config.label is not a component already.
     * Default: {@link LabelStyle.Text}
     */
    labelStyle?: LabelStyle;
    /**
     * The component that configures a setting.
     */
    settingComponent?: Component<ComponentConfig>;
    /**
     * If the setting should be added as a component to this item.
     */
    addSettingAsComponent?: boolean;
    /**
     * Indicates if the SettingsPanelItem is representing an actual setting or if it just a label. E.g. when used
     * as a title.
     */
    isSetting?: boolean;
}
/**
 * An item for a {@link SettingsPanelPage},
 * Containing an optional {@link Label} and a component that configures a setting.
 * If the components is a {@link SelectBox} it will handle the logic of displaying it or not
 *
 * @category Components
 */
export declare class SettingsPanelItem<Config extends SettingsPanelItemConfig> extends Container<Config> {
    private label;
    protected settingComponent: Component<ComponentConfig> | null;
    private settingsPanelItemEvents;
    constructor(config: SettingsPanelItemConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected onLanguageChanged(): void;
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    isActive(): boolean;
    protected onActiveChangedEvent(): void;
    /**
     * Gets the event that is fired when the 'active' state of this item changes.
     * @see #isActive
     * @returns {Event<SettingsPanelItem, NoArgs>}
     */
    get onActiveChanged(): Event<SettingsPanelItem<Config>, NoArgs>;
}
