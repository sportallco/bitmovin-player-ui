import { ButtonConfig, Button } from './Button';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';

const RADIO_MODE_CHANGED_EVENT = 'isRadioModeActiveChange';

interface RadioModeWindow extends Window {
  isRadioModeActive?: boolean | null;
}

/**
 * Installs `window.isRadioModeActive` as an accessor that dispatches an `isRadioModeActiveChange` CustomEvent on
 * every write, so the embedding application can observe radio mode changes. Applications that define the property
 * themselves keep ownership of it, the UI only writes to it.
 */
function ensureRadioModeState(radioModeWindow: RadioModeWindow): void {
  if (typeof radioModeWindow.isRadioModeActive !== 'undefined') {
    return;
  }

  let isRadioModeActive: boolean | null = null;

  Object.defineProperty(radioModeWindow, 'isRadioModeActive', {
    configurable: true,
    get: () => isRadioModeActive,
    set: (value: boolean | null) => {
      isRadioModeActive = value;
      radioModeWindow.dispatchEvent(new CustomEvent(RADIO_MODE_CHANGED_EVENT, { detail: value }));
    },
  });
}

/**
 * A button that toggles `window.isRadioModeActive` and notifies the embedding application about the change through
 * an `isRadioModeActiveChange` CustomEvent on `window`. Switching to and from radio mode is up to the application,
 * the button does not change the UI itself.
 *
 * @category Buttons
 */
export class RadioModeButton extends Button<ButtonConfig> {
  constructor(config: ButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(
      config,
      {
        cssClass: 'ui-radiomodebutton',
        text: 'Radio Mode',
        ariaLabel: 'Radio Mode',
      } as ButtonConfig,
      this.config,
    );
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    const radioModeWindow = window as RadioModeWindow;
    ensureRadioModeState(radioModeWindow);

    this.onClick.subscribe(() => {
      radioModeWindow.isRadioModeActive = !radioModeWindow.isRadioModeActive;
    });
  }
}
