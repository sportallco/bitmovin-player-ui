import { NavigationGroup } from './NavigationGroup';
import { Action, Focusable } from './types';
import { SettingsPanel, SettingsPanelConfig } from '../components/settings/SettingsPanel';
export declare class SettingsPanelNavigationGroupConfig {
    /**
     * If true, the SettingsPanel will close when an item is selected.
     * Default: true.
     */
    closeOnSelect?: boolean;
}
/**
 * Extend NavigationGroup to provide additional logic for navigating within a SettingsPanel.
 *
 * @category Components
 */
export declare class SettingsPanelNavigationGroup extends NavigationGroup {
    private readonly settingsPanel;
    private readonly config;
    constructor(settingsPanel: SettingsPanel<SettingsPanelConfig>, config?: SettingsPanelNavigationGroupConfig | undefined);
    getComponents(): Focusable[];
    protected defaultActionHandler(action: Action): void;
}
