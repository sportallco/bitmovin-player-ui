import { ToggleButton, ToggleButtonConfig } from './ToggleButton';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * A toggle that lets the end-user opt in to having their volume, mute and playback
 * speed remembered across sessions. Reflects and drives the {@link UIPreferencesManager}
 * `enabled` state. Only added to the UI when the integrator sets
 * `UIConfig.showPersistentPreferencesToggle`.
 *
 * @category Buttons
 */
export declare class PersistentPreferencesToggleButton extends ToggleButton<ToggleButtonConfig> {
    constructor(config?: ToggleButtonConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
