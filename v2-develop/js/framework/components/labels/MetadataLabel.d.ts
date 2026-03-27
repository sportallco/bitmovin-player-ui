import { LabelConfig, Label } from './Label';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Enumerates the types of content that the {@link MetadataLabel} can display.
 */
export declare enum MetadataLabelContent {
    /**
     * Title of the data source.
     */
    Title = 0,
    /**
     * Description of the data source.
     */
    Description = 1
}
/**
 * Configuration interface for {@link MetadataLabel}.
 *
 * @category Configs
 */
export interface MetadataLabelConfig extends LabelConfig {
    /**
     * The type of content that should be displayed in the label.
     */
    content: MetadataLabelContent;
}
/**
 * A label that can be configured to display certain metadata.
 *
 * @category Labels
 */
export declare class MetadataLabel extends Label<MetadataLabelConfig> {
    constructor(config: MetadataLabelConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
