import type { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../../UIManager';
import { SettingsPanel, SettingsPanelConfig } from '../../settings/SettingsPanel';
/**
 * Configuration interface for a {@link PlayerInsightsPanel}.
 *
 * @category Configs
 */
export interface PlayerInsightsPanelConfig extends SettingsPanelConfig {
    /**
     * The interval in milliseconds at which the displayed values are refreshed while playback is active.
     * Set to -1 to disable periodic refreshes.
     * Default: 1000
     */
    refreshIntervalMs?: number;
}
/**
 * Player diagnostics panel composed from settings-panel rows.
 *
 * @category Components
 */
export declare class PlayerInsightsPanel extends SettingsPanel<PlayerInsightsPanelConfig> {
    private readonly insightsProvider;
    private readonly insightItems;
    constructor(config?: PlayerInsightsPanelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
    private readonly playerInsightsChangedHandler;
}
