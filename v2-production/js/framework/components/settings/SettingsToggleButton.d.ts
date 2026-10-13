import { ToggleButton, ToggleButtonConfig } from '../buttons/ToggleButton';
import { SettingsPanel, SettingsPanelConfig } from './SettingsPanel';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link SettingsToggleButton}.
 *
 * @category Configs
 */
export interface SettingsToggleButtonConfig extends ToggleButtonConfig {
    /**
     * The settings panel whose visibility the button should toggle.
     */
    settingsPanel: SettingsPanel<SettingsPanelConfig>;
    /**
     * Decides if the button should be automatically hidden when the settings panel does not contain any active settings.
     * Default: true
     */
    autoHideWhenNoActiveSettings?: boolean;
}
/**
 * A button that toggles visibility of a settings panel.
 *
 * @category Buttons
 */
export declare class SettingsToggleButton extends ToggleButton<SettingsToggleButtonConfig> {
    private visibleSettingsPanels;
    constructor(config: SettingsToggleButtonConfig);
    private updateAriaPanelIdRefs;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
