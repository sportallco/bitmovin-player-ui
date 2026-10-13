import type { PlayerAPI } from 'bitmovin-player';
import type { UIInstanceManager } from '../../../UIManager';
import { InteractiveContextMenuItem, InteractiveContextMenuItemConfig } from '../../contextmenu/InteractiveContextMenuItem';
import type { PlayerInsightsPanel } from './PlayerInsightsPanel';
/**
 * Configuration interface for a {@link PlayerInsightsContextMenuItem}.
 *
 * @category Configs
 */
export interface PlayerInsightsContextMenuItemConfig extends InteractiveContextMenuItemConfig {
    /**
     * The {@link PlayerInsightsPanel} whose visibility the item should toggle.
     */
    playerInsightsPanel: PlayerInsightsPanel;
}
/**
 * A context menu item that toggles a {@link PlayerInsightsPanel}.
 *
 * @category Components
 */
export declare class PlayerInsightsContextMenuItem extends InteractiveContextMenuItem<PlayerInsightsContextMenuItemConfig> {
    private readonly itemLabel;
    private readonly playerInsightsPanel;
    constructor(config: PlayerInsightsContextMenuItemConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
