import { ContainerConfig, Container } from '../Container';
import { UIInstanceManager } from '../../UIManager';
import { HugeReplayButton } from '../buttons/HugeReplayButton';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Overlays the player and displays recommended videos.
 *
 * @category Containers
 */
export declare class RecommendationOverlay extends Container<ContainerConfig> {
    private static readonly CLASS_HAS_RECOMMENDATIONS;
    readonly replayButton: HugeReplayButton;
    readonly recommendationContainer: Container<ContainerConfig>;
    constructor(config?: ContainerConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
