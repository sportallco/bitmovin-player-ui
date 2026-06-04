import { Container, ContainerConfig } from '../Container';
import { UIInstanceManager } from '../../UIManager';
import { Label, LabelConfig } from '../labels/Label';
import { Size } from '../../DOM';
import { PlayerAPI, SubtitleCueEvent } from 'bitmovin-player';
import { VTTProperties } from 'bitmovin-player/types/subtitles/vtt/API';
import { ListItemFilter } from '../lists/ListSelector';
interface SubtitleCropDetectionResult {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}
export interface SubtitleOverlayConfig extends ContainerConfig {
    /**
     * Controls whether CEA-608 caption-specific text formatting (monospaced font, uppercase transform,
     * and character letter-spacing) is applied. The CEA-608 grid-based row/column positioning is
     * always preserved so captions still render at their authored on-screen positions.
     *
     * Defaults to `true` (CEA-608 text formatting is applied, matching historical behavior).
     */
    enableCea608CaptionFormatting?: boolean;
}
/**
 * Overlays the player to display subtitles.
 *
 * @category Components
 */
export declare class SubtitleOverlay extends Container<SubtitleOverlayConfig> {
    private subtitleManager;
    private previewSubtitleActive;
    private previewSubtitle;
    private preprocessLabelEventCallback;
    private subtitleContainerManager;
    private static readonly CLASS_CONTROLBAR_VISIBLE;
    private static readonly CLASS_CEA_608;
    private static readonly CLASS_CEA608_PUSHUP_DISABLED;
    private static readonly DEFAULT_CEA608_SMALL_PLAYER_HEIGHT_THRESHOLD;
    private static readonly CLASS_CEA_608_FORMATTING;
    private static readonly CEA608_NUM_ROWS;
    private static readonly CEA608_NUM_COLUMNS;
    private static readonly CEA608_COLUMN_OFFSET;
    private static readonly DEFAULT_CAPTION_LEFT_OFFSET;
    private cea608Enabled;
    private cea608FontSizeFactor;
    private ensureCea608GridSizeUpdated;
    private cea608SmallPlayerHeightThreshold;
    constructor(config?: SubtitleOverlayConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private updateCea608PushupFromPlayerHeight;
    setFontSizeFactor(factor: number): void;
    detectCroppedSubtitleLabel(labelElement: HTMLElement): SubtitleCropDetectionResult;
    handleSubtitleCropping(label: SubtitleLabel): void;
    generateLabel(event: SubtitleCueEvent): SubtitleLabel;
    filterFontSizeOptions: ListItemFilter;
    resolveFontSizeFactor(value: string): number;
    configureCea608Captions(player: PlayerAPI, uimanager: UIInstanceManager): void;
    enablePreviewSubtitleLabel(): void;
    removePreviewSubtitleLabel(): void;
    private isCea608FormattingEnabled;
}
interface SubtitleLabelConfig extends LabelConfig {
    vtt?: VTTProperties;
    region?: string;
    regionStyle?: string;
    originalRowPosition?: number;
}
export declare class SubtitleLabel extends Label<SubtitleLabelConfig> {
    constructor(config?: SubtitleLabelConfig);
    get vtt(): VTTProperties;
    get region(): string;
    get regionStyle(): string;
    get originalRowPosition(): number;
    set regionStyle(style: string);
    set originalRowPosition(row: number);
}
export declare class SubtitleRegionContainerManager {
    private subtitleOverlay;
    private subtitleRegionContainers;
    /**
     * @param subtitleOverlay Reference to the subtitle overlay for adding and removing the containers.
     */
    constructor(subtitleOverlay: SubtitleOverlay);
    private getRegion;
    /**
     * Creates and wraps a subtitle label into a container div based on the subtitle region.
     * If the subtitle has positioning information it is added to the container.
     * @param label The subtitle label to wrap
     */
    addLabel(label: SubtitleLabel, overlaySize?: Size): void;
    replaceLabel(previousLabel: SubtitleLabel, newLabel: SubtitleLabel, overlaySize?: Size): void;
    /**
     * Removes a subtitle label from a container.
     */
    removeLabel(label: SubtitleLabel): void;
    /**
     * Removes all subtitle containers.
     */
    clear(): void;
}
export declare class SubtitleRegionContainer extends Container<ContainerConfig> {
    private labelCount;
    constructor(config?: ContainerConfig);
    addLabel(labelToAdd: SubtitleLabel, overlaySize?: Size): void;
    removeLabel(labelToRemove: SubtitleLabel): void;
    isEmpty(): boolean;
}
export {};
