import { PlayerAPI, VideoQuality } from 'bitmovin-player';
import { Container, ContainerConfig } from './Container';
import { Label, LabelConfig } from './labels/Label';
/**
 * @category Containers
 */
export declare class EcoModeContainer extends Container<ContainerConfig> {
    private ecoModeSavedEmissionsItem;
    private ecoModeToggleButtonItem;
    private emissionsSavedLabel;
    private savedEmissons;
    private currentEnergyEmission;
    constructor(config?: ContainerConfig);
    private onToggleCallback;
    setOnToggleCallback(callback: () => void): void;
    configure(player: PlayerAPI): void;
    updateSavedEmissions(currentEnergyConsuption: number, maxEnergyConsuption: number, emissionsSavedLabel: Label<LabelConfig>): void;
    /**
     * The calculations are based on the following paper: https://arxiv.org/pdf/2210.05444.pdf
     */
    calculateEnergyConsumption(fps: number, height: number, width: number, bitrate: number, duration: number): number;
    getMaxQualityAvailable(availableVideoQualities: VideoQuality[]): VideoQuality;
}
