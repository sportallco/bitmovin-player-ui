import { ButtonConfig } from '../buttons/Button';
import { Component, ComponentConfig } from '../Component';
import { Container } from '../Container';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
export interface DismissClickOverlayConfig extends ButtonConfig {
    target: Component<ComponentConfig>;
}
export declare class DismissClickOverlay extends Container<DismissClickOverlayConfig> {
    constructor(config: DismissClickOverlayConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
