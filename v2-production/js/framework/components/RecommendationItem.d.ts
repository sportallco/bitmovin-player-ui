import { Component, ComponentConfig } from './Component';
import { RecommendationConfig } from '../UIConfig';
import { NoArgs, Event } from '../EventDispatcher';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../UIManager';
import { DOM } from '../DOM';
/**
 * Configuration interface for the {@link RecommendationItem}
 */
export interface RecommendationItemConfig extends ComponentConfig {
    /**
     * The recommendation configuration for this item.
     */
    recommendationConfig: RecommendationConfig;
}
/**
 * An item of the {@link RecommendationOverlay}.
 */
export declare class RecommendationItem extends Component<RecommendationItemConfig> {
    private events;
    constructor(config: RecommendationItemConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected toDomElement(): DOM;
    protected onClickEvent(): void;
    get onClick(): Event<RecommendationItem, NoArgs>;
}
