import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../UIManager';
import { DOM } from '../DOM';
import { ComponentConfig } from '../components/Component';
import { SeekBarMarker } from '../components/seekbar/SeekBar';
/**
 * @category Configs
 */
export interface MarkersConfig extends ComponentConfig {
    /**
     * Used for seekBar marker snapping range percentage
     */
    snappingRange?: number;
    /**
     * The interval in milliseconds in which marker positions will be updated for live streams.
     * Default: 1000
     */
    markerUpdateIntervalMs?: number;
}
export declare class TimelineMarkersHandler {
    private markersContainer;
    private timelineMarkers;
    private player;
    private uimanager;
    private markerPositionUpdater;
    private getSeekBarWidth;
    protected config: MarkersConfig;
    private isTimeShifting;
    private seekableRangeSnapshot;
    constructor(config: MarkersConfig, getSeekBarWidth: () => number, markersContainer: DOM);
    initialize(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private configureMarkers;
    getMarkerAtPosition(percentage: number): SeekBarMarker | null;
    private clearMarkers;
    private removeMarkerFromConfig;
    private filterRemovedMarkers;
    private removeMarkerFromDOM;
    private updateMarkers;
    private getMarkerCssProperties;
    private updateMarkerDOM;
    private createMarkerDOM;
    private updateMarkersDOM;
    private startLiveMarkerUpdater;
    private stopLiveMarkerUpdater;
    private captureSeekableRangeSnapshot;
    private getSeekableRangeRespectingSnapshot;
}
