import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
import { ToggleButton, ToggleButtonConfig } from '../buttons/ToggleButton';
import { InteractiveSettingsPanelItem } from './InteractiveSettingsPanelItem';
import { SettingsPanelItemConfig } from './SettingsPanelItem';
/**
 * Configuration interface for a {@link ToggleSettingsPanelItem}.
 *
 * @category Configs
 */
export interface ToggleSettingsPanelItemConfig extends SettingsPanelItemConfig {
    /**
     * The toggle button that will be toggled when this item is clicked.
     */
    settingComponent: ToggleButton<ToggleButtonConfig>;
}
/**
 * A settings panel item that toggles a {@link ToggleButton} when the row is clicked.
 *
 * @category Components
 */
export declare class ToggleSettingsPanelItem extends InteractiveSettingsPanelItem<ToggleSettingsPanelItemConfig> {
    protected settingComponent: ToggleButton<ToggleButtonConfig>;
    constructor(config: ToggleSettingsPanelItemConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private updateAriaChecked;
}
