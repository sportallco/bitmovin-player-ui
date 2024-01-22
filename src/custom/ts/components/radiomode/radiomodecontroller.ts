import { EventDispatcher } from '../../../../ts/eventdispatcher';

export interface RadioModeChangedArgs {
  activated: boolean;
}

/**
 * Handles the radio mode state.
 */
export class RadioModeController {
  private activated: boolean;
  private readonly events = {
    onChanged: new EventDispatcher<RadioModeController, RadioModeChangedArgs>(),
  };

  constructor() {
    this.activated = false;
  }

  /**
   * @param activated - Boolean state of the radio mode.
   */
  setRadioMode(activated: boolean): void {
    this.activated = activated;
    this.onChangedEvent();
  }

  toggleRadioMode(): void {
    this.setRadioMode(!this.activated);
  }

  /**
   * @returns Boolean state of the radio mode.
   */
  isRadioModeActivated(): boolean {
    return this.activated;
  }

  /**
   * Trigger the onChanged event.
   */
  private onChangedEvent(): void {
    this.events.onChanged.dispatch(this, { activated: this.activated });
  }

  /**
   * Get the onChanged event.
   */
  get onChanged() {
    return this.events.onChanged.getEvent();
  }
}