import { i18n } from '../../../ts/localization/i18n';
import { UIInstanceManager } from '../../../ts/uimanager';
import { Button, ButtonConfig } from '../../../ts/components/button';
import { PlayerAPI } from 'bitmovin-player';

/**
 * Configuration interface for the {@link ResetButton}.
 */
export interface ResetButtonConfig extends ButtonConfig {}

/**
 * A button that Reset video / live to the beginning
 */
export class ResetButton extends Button<ResetButtonConfig> {
  constructor(config: ResetButtonConfig) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: 'ui-resetbutton',
        text: i18n.getLocalizer('resetbutton'),
      } as ResetButtonConfig,
      this.config,
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // if player is not live, do not show the button
    if (!player.isLive()) {
      this.hide();
    } else {
      this.show();
    }

    this.onClick.subscribe(() => {
      player.timeShift(-player.getMaxTimeShift(), 'ui');
    });
  }
}
