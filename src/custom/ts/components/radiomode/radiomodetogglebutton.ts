import { RadioModeController } from './radiomodecontroller';
import { PlayerAPI } from 'bitmovin-player';
import { ToggleButton, ToggleButtonConfig } from '../../../../ts/components/togglebutton';
import { UIInstanceManager } from '../../../../ts/uimanager';

declare const window: any;

export class RadioModeToggleButton extends ToggleButton<ToggleButtonConfig> {
  private radioModeController: RadioModeController;

  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    const defaultConfig: ToggleButtonConfig = {
      cssClass: 'ui-radiomodetogglebutton',
      text: 'Radio Mode',
      ariaLabel: 'Radio Mode',
    };

    this.config = this.mergeConfig(config, defaultConfig, this.config);
    this.radioModeController = new RadioModeController();
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);


    this.radioModeController.onChanged.subscribe((sender, args) => {
      if (window.bitmovin.customMessageHandler) {
        window.bitmovin.customMessageHandler.sendAsynchronous(
          'radioModeChanged',
          JSON.stringify({ activated: args.activated }),
        );
      }
    });

    if (window.bitmovin.customMessageHandler) {
      window.bitmovin.customMessageHandler.on(
        'radioModeChanged',
        (data?: string) => {
          if (data) {
            const activated = JSON.parse(data).activated;
            this.radioModeController.setRadioMode(activated);
            if (activated) {
              this.on();
            } else {
              this.off();
            }
          }
        },
      );

      this.onClick.subscribe(() => {
        console.log('[RadioModeToggleButton] Button clicked');
        this.radioModeController.toggleRadioMode();

        if (this.radioModeController.isRadioModeActivated()) {
          this.on();
        } else {
          this.off();
        }
        window.bitmovin.customMessageHandler.sendAsynchronous(
          'radioModeChanged',
          JSON.stringify({
            before: !this.radioModeController.isRadioModeActivated(),
            after: this.radioModeController.isRadioModeActivated(),
            activated: this.radioModeController.isRadioModeActivated(),
          }),
        );
      });
    }

    if (this.radioModeController.isRadioModeActivated()) {
      this.on();
    } else {
      this.off();
    }
  }
}
