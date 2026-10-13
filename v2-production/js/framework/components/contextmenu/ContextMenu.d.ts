import { SettingsPanel, SettingsPanelConfig } from '../settings/SettingsPanel';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { Component, ComponentConfig } from '../Component';
/**
 * Configuration interface for a generic {@link ContextMenu}.
 *
 * @category Configs
 */
export interface ContextMenuConfig extends SettingsPanelConfig {
}
/**
 * A floating context menu shown at the pointer position when the user opens the
 * browser context menu inside the player UI.
 *
 * @category Components
 */
export declare class ContextMenu<Config extends ContextMenuConfig = ContextMenuConfig> extends SettingsPanel<Config> {
    private contextMenuHost;
    constructor(config?: Config);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
    addComponent(component: Component<ComponentConfig>): void;
    prependComponent(component: Component<ComponentConfig>): void;
    removeComponent(component: Component<ComponentConfig>): boolean;
    showAt(clientX: number, clientY: number): void;
    private isEventTargetInsideContextMenu;
    private isEventTargetInsideElement;
    private attachContextMenuElement;
    private setContextMenuForComponent;
    private unsetContextMenuForComponent;
}
