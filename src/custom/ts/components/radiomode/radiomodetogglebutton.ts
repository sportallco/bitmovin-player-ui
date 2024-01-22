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

    // Écoutez les changements d'état du mode radio
    this.radioModeController.onChanged.subscribe((_, args) => {
      console.log(`[RadioModeToggleButton] Radio mode state changed: ${args.activated}`);
      if (args.activated) {
        this.on();
      } else {
        this.off();
      }

      // Send the current state to the outside (e.g. to the React Native app)
      window.bitmovin.customMessageHandler.sendAsynchronous('radioModeChanged', JSON.stringify({ activated: args.activated }));
    });

    // Handle clicks on the button
    this.onClick.subscribe(() => {
      console.log('[RadioModeToggleButton] Button clicked');
      this.radioModeController.toggleRadioMode();

      // Send synchronous or asynchronous messages to the outside (e.g. to the React Native app)
      const result = window.bitmovin.customMessageHandler.sendSynchronous('toggleRadioMode');
      console.log('Return value from native:', result);
    });

    if (window.bitmovin && window.bitmovin.customMessageHandler) {
      window.bitmovin.customMessageHandler.on('toggleRadioMode', (data?: string) => {
        this.radioModeController.toggleRadioMode();
      });
    }

    // Initialise l'état du bouton au démarrage
    if (this.radioModeController.isRadioModeActivated()) {
      this.on();
    } else {
      this.off();
    }
  }
}
