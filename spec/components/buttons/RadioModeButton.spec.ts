import { MockHelper, TestingPlayerAPI } from '../../helper/MockHelper';
import { UIInstanceManager } from '../../../src/ts/UIManager';
import { RadioModeButton } from '../../../src/ts/components/buttons/RadioModeButton';

let playerMock: TestingPlayerAPI;
let uiInstanceManagerMock: UIInstanceManager;

function radioModeWindow(): Window & { isRadioModeActive?: boolean | null } {
  return window as Window & { isRadioModeActive?: boolean | null };
}

/**
 * Builds a configured button and returns a function that triggers the click handler it registered on its DOM
 * element. The DOM module is mocked in specs, so the handler cannot be triggered through a real click event.
 */
function buildConfiguredButton(): () => void {
  const radioModeButton = new RadioModeButton();
  radioModeButton.initialize();
  radioModeButton.configure(playerMock, uiInstanceManagerMock);

  const domEventRegistrations = radioModeButton.getDomElement().on as jest.Mock;
  const clickRegistration = domEventRegistrations.mock.calls.find(([eventName]) => eventName === 'click');

  return () => clickRegistration[1]({ preventDefault: jest.fn() });
}

describe('RadioModeButton', () => {
  beforeEach(() => {
    delete radioModeWindow().isRadioModeActive;

    playerMock = MockHelper.getPlayerMock();
    uiInstanceManagerMock = MockHelper.getUiInstanceManagerMock();
  });

  afterEach(() => {
    delete radioModeWindow().isRadioModeActive;
  });

  it('toggles window.isRadioModeActive on click', () => {
    const click = buildConfiguredButton();
    expect(radioModeWindow().isRadioModeActive).toBe(null);

    click();
    expect(radioModeWindow().isRadioModeActive).toBe(true);

    click();
    expect(radioModeWindow().isRadioModeActive).toBe(false);
  });

  it('dispatches an isRadioModeActiveChange event on every change', () => {
    const listener = jest.fn();
    window.addEventListener('isRadioModeActiveChange', listener);
    const click = buildConfiguredButton();

    click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent<boolean>).detail).toBe(true);

    window.removeEventListener('isRadioModeActiveChange', listener);
  });

  it('keeps a window.isRadioModeActive defined by the embedding application', () => {
    const applicationListener = jest.fn();
    let applicationState: boolean | null = null;
    Object.defineProperty(window, 'isRadioModeActive', {
      configurable: true,
      get: () => applicationState,
      set: (value: boolean | null) => {
        applicationState = value;
        applicationListener(value);
      },
    });

    buildConfiguredButton()();

    expect(applicationListener).toHaveBeenCalledWith(true);
    expect(radioModeWindow().isRadioModeActive).toBe(true);
  });
});
