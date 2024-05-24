import { PlayerAPI } from 'bitmovin-player';
import { ToggleButton, ToggleButtonConfig } from '../../../../ts/components/togglebutton';
import { UIInstanceManager } from '../../../../ts/uimanager';

declare const window: any;

export interface RadioModeToggleButtonConfig extends ToggleButtonConfig {
  /**
   * Decides the initial state of the toggle button
   * Default: false
   */
  active: boolean;
}

export class RadioModeToggleButton extends ToggleButton<RadioModeToggleButtonConfig> {
  constructor(config: RadioModeToggleButtonConfig) {
    super(config);

    const defaultConfig: RadioModeToggleButtonConfig = {
      cssClass: config.active ? 'ui-closebutton' : 'ui-radiomodetogglebutton',
      text: 'Radio Mode',
      ariaLabel: 'Radio Mode',
      active: false,
    };

    this.config = this.mergeConfig(config, defaultConfig, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      // Mobile
      const initialState = this.config.active;
      if (window.bitmovin.customMessageHandler) {
        window.bitmovin.customMessageHandler.sendAsynchronous(
          'radioModeChanged',
          JSON.stringify({
            initialState,
            activated: !this.config.active,
          }),
        );
      }

      // Web
      window.isRadioModeActive = !window.isRadioModeActive
    });
  }
}
