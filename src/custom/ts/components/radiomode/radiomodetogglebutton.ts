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

    if (window.bitmovin.customMessageHandler) {
      window.bitmovin.customMessageHandler.on(
        'globalRadioModeChanged',
        (data?: string) => {
          const activated = data === 'true';

          this.radioModeController.setRadioMode(activated);

          this.updateButtonState(true);

          window.bitmovin.customMessageHandler.sendAsynchronous(
            'radioModeLogs',
            JSON.stringify({
              message: 'Radio Mode changed',
              data,
              before: !this.radioModeController.isRadioModeActivated(),
              current: this.radioModeController.isRadioModeActivated(),
            }),
          );
        },
      );
    }
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      const initialState = this.radioModeController.isRadioModeActivated();
      this.radioModeController.toggleRadioMode();

      this.updateButtonState(this.radioModeController.isRadioModeActivated());

      if (window.bitmovin.customMessageHandler) {
        window.bitmovin.customMessageHandler.sendAsynchronous(
          'radioModeChanged',
          JSON.stringify({
            initialState,
            activated: this.radioModeController.isRadioModeActivated(),
          }),
        );
      }
    });
  }

  private updateButtonState(activated: boolean): void {
    if (activated) {
      this.on();
    } else {
      this.off();
    }
  }
}
