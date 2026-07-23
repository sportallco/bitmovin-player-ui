import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
import { ContextMenu, ContextMenuConfig } from './ContextMenu';
import type { PlayerInsightsPanel } from '../panels/player-insights/PlayerInsightsPanel';
/**
 * Configuration interface for the {@link PlayerContextMenu}.
 *
 * @category Configs
 */
export interface PlayerContextMenuConfig extends ContextMenuConfig {
    /**
     * The player insights panel to expose as a default context menu action.
     */
    playerInsightsPanel: PlayerInsightsPanel;
}
/**
 * A player-specific context menu with Bitmovin info and Player/UI versions.
 *
 * @category Components
 */
export declare class PlayerContextMenu extends ContextMenu<PlayerContextMenuConfig> {
    private readonly copyTimestampLinkItem;
    constructor(config: PlayerContextMenuConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
