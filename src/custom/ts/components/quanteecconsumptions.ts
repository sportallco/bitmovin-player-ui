import { PlayerAPI, PlayerEvent } from 'bitmovin-player';
import { Button, ButtonConfig } from '../../../ts/components/button';
import { UIInstanceManager } from '../../../ts/uimanager';

declare const window: any;

interface QuanteecConsumptionsConfig extends ButtonConfig {
}

export class QuanteecConsumptions extends Button<ButtonConfig> {
  constructor(config: QuanteecConsumptionsConfig = {}) {
    super(config);

    const defaultConfig: ButtonConfig = {
      cssClass: 'ui-quanteecconsumptions',
      text: 'Get Quanteec consumptions',
      ariaLabel: 'Get Quanteec consumptions',
    };

    this.config = this.mergeConfig(config, defaultConfig, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      // web handle
      window.isQuanteecDisplayed = !window.isQuanteecDisplayed;
    });
  }
}
