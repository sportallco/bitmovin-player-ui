import { Button, ButtonConfig } from '../../../ts/components/button';
import { UIInstanceManager } from '../../../ts/uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../../ts/localization/i18n';

export interface PlaybackJumpButtonsConfig extends ButtonConfig {
  skipTime: number; // in seconds
}

export class PlaybackJumpButtons extends Button<PlaybackJumpButtonsConfig> {

  constructor(config: PlaybackJumpButtonsConfig) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-playbackjumpbuttons',
      text: config.text,
      ariaLabel: config.ariaLabel,
      skipTime: 0,
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (!player.isLive()) {
        let newTime = currentTime + this.config.skipTime;
        newTime = Math.max(0, Math.min(newTime, duration));
        player.seek(newTime, 'ui');
      }
    });
  }
}

export class PlaybackForwardButton extends PlaybackJumpButtons {
  constructor(config: PlaybackJumpButtonsConfig) {
    super({
      ...config,
      cssClass: 'ui-playbackforwardbutton',
      text: i18n.getLocalizer('forward'),
      ariaLabel: i18n.getLocalizer('forward'),
    });
  }
}

export class PlaybackRewindButton extends PlaybackJumpButtons {
  constructor(config: PlaybackJumpButtonsConfig) {
    super({
      ...config,
      cssClass: 'ui-playbackrewindbutton',
      text: i18n.getLocalizer('rewind'),
      ariaLabel: i18n.getLocalizer('rewind'),
    });
  }
}
