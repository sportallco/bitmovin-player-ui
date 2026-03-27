import { Container, ContainerConfig } from './Container';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for a {@link TitleBar}.
 *
 * @category Configs
 */
export interface TitleBarConfig extends ContainerConfig {
    /**
     * Specifies if the title bar should stay hidden when no label contains any text.
     * Applies to any label component with an isEmpty() method, not just MetadataLabels.
     * Default: false
     */
    keepHiddenWithoutMetadata?: boolean;
}
/**
 * Displays a title bar containing a label with the title of the video or other contextual messages.
 *
 * @category Components
 */
export declare class TitleBar extends Container<TitleBarConfig> {
    constructor(config?: TitleBarConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private hasNonEmptyComponents;
    private subscribeToTextChanges;
}
