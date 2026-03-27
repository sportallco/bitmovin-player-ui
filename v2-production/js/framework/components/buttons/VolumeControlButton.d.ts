import { Container, ContainerConfig } from '../Container';
import { VolumeSlider } from '../seekbar/VolumeSlider';
import { VolumeToggleButton } from './VolumeToggleButton';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Configuration interface for a {@link VolumeControlButton}.
 *
 * @category Configs
 */
export interface VolumeControlButtonConfig extends ContainerConfig {
    /**
     * The delay after which the volume slider will be hidden when there is no user interaction.
     * Care must be taken that the delay is long enough so users can reach the slider from the toggle button, e.g. by
     * mouse movement. If the delay is too short, the sliders disappears before the mouse pointer has reached it and
     * the user is not able to use it.
     * Default: 500ms
     */
    hideDelay?: number;
    /**
     * Specifies if the volume slider should be vertically or horizontally aligned.
     * Default: true
     */
    vertical?: boolean;
}
/**
 * A composite volume control that consists of and internally manages a volume control button that can be used
 * for muting, and a (depending on the CSS style, e.g. slide-out) volume control bar.
 *
 * @category Buttons
 */
export declare class VolumeControlButton extends Container<VolumeControlButtonConfig> {
    private volumeToggleButton;
    private volumeSlider;
    private volumeSliderHideTimeout;
    constructor(config?: VolumeControlButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    release(): void;
    /**
     * Provides access to the internally managed volume toggle button.
     * @returns {VolumeToggleButton}
     */
    getVolumeToggleButton(): VolumeToggleButton;
    /**
     * Provides access to the internally managed volume silder.
     * @returns {VolumeSlider}
     */
    getVolumeSlider(): VolumeSlider;
}
