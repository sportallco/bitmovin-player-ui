import { ButtonConfig, Button } from './Button';
import { UIInstanceManager } from '../../UIManager';
import { Component, ComponentConfig } from '../Component';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for the {@link CloseButton}.
 *
 * @category Configs
 */
export interface CloseButtonConfig extends ButtonConfig {
    /**
     * The component that should be closed when the button is clicked.
     */
    target: Component<ComponentConfig>;
}
/**
 * A button that closes (hides) a configured component.
 *
 * @category Buttons
 */
export declare class CloseButton extends Button<CloseButtonConfig> {
    constructor(config: CloseButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
