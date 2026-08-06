import { ButtonConfig, Button } from './Button';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';
import { getCustomMessageHandler } from '../../utils/CustomMessageHandler';

export class BackButton extends Button<ButtonConfig> {
  constructor(config: ButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: 'ui-backbutton',
        text: i18n.getLocalizer('back'),
      } as ButtonConfig,
      this.config,
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      const customMessageHandler = getCustomMessageHandler();
      if (customMessageHandler) {
        customMessageHandler.sendAsynchronous('goBack');
      }
    });
  }
}
