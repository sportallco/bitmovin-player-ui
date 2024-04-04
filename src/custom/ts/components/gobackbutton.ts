import { PlayerAPI, PlayerEvent } from 'bitmovin-player';
import { Button, ButtonConfig } from '../../../ts/components/button';
import { UIInstanceManager } from '../../../ts/uimanager';

declare const window: any;

interface GoBackButtonConfig extends ButtonConfig {
  error?: boolean;
}

export class GoBackButton extends Button<ButtonConfig> {
  constructor(config: GoBackButtonConfig = { error: false }) {
    super(config);

    const defaultConfig: ButtonConfig = {
      cssClasses: config.error ? ['ui-gobackbutton', 'ui-gobackbutton-error'] : ['ui-gobackbutton'],
      text: 'Go Back',
      ariaLabel: 'Go Back',
    };

    this.config = this.mergeConfig(config, defaultConfig, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.bitmovin.customMessageHandler.sendAsynchronous('goBack');
    });

    player.on(player.exports.PlayerEvent.ViewModeChanged, () => {
      player.getViewMode() === 'fullscreen' ? this.hide() : this.show();
    });
  }
}
