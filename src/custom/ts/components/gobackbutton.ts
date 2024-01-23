import { PlayerAPI, PlayerEvent } from 'bitmovin-player';
import { Button, ButtonConfig } from '../../../ts/components/button';
import { UIInstanceManager } from '../../../ts/uimanager';

declare const window: any;

export class GoBackButton extends Button<ButtonConfig> {
  constructor(config: ButtonConfig = {}) {
    super(config);

    const defaultConfig: ButtonConfig = {
      cssClass: 'ui-gobackbutton',
      text: 'Go Back',
      ariaLabel: 'Go Back',
    };

    this.config = this.mergeConfig(config, defaultConfig, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      console.log('[GoBack] Button clicked');

      window.bitmovin.customMessageHandler.sendAsynchronous('goBack');
    });

    player.on(player.exports.PlayerEvent.ViewModeChanged, () => {
      player.getViewMode() === 'fullscreen' ? this.hide() : this.show();
    });
  }
}
