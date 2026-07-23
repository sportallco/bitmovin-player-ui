import { InteractiveSettingsPanelItem } from '../settings/InteractiveSettingsPanelItem';
import { SettingsPanelItemConfig } from '../settings/SettingsPanelItem';
import type { ContextMenu, ContextMenuConfig } from './ContextMenu';
/**
 * Configuration interface for a generic {@link InteractiveContextMenuItem}.
 *
 * @category Configs
 */
export interface InteractiveContextMenuItemConfig extends SettingsPanelItemConfig {
    /**
     * Whether the containing context menu should close after this item emits an action.
     * Default: false
     */
    closeContextMenuOnAction?: boolean;
}
/**
 * A generic action item for use inside a {@link ContextMenu}.
 *
 * @category Components
 */
export declare class InteractiveContextMenuItem<Config extends InteractiveContextMenuItemConfig> extends InteractiveSettingsPanelItem<Config> {
    private contextMenu;
    constructor(config: Config);
    setContextMenu(contextMenu: ContextMenu<ContextMenuConfig> | null): void;
    protected onClickEvent(): void;
    private closeContextMenuForAction;
}
