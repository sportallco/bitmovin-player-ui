import { Button, ButtonConfig } from './Button';
import { NoArgs, Event } from '../../EventDispatcher';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
/**
 * Configuration interface for a toggle button component.
 *
 * @category Configs
 */
export interface ToggleButtonConfig extends ButtonConfig {
    /**
     * The CSS class that marks the on-state of the button.
     */
    onClass?: string;
    /**
     * The CSS class that marks the off-state of the button.
     */
    offClass?: string;
    /**
     * WCAG20 standard for defining info about the component (usually the name)
     *
     * It is recommended to use `onAriaLabel` and `offAriaLabel` for toggle buttons
     * as the component can then update them as the button is used. If this is the case,
     * the `aria-pressed` attribute is not set as the specification defines either the name
     * or the pressed-state should be changed, but not both.
     * Some platforms, like many versions of Samsung Tizen TVs, don't support the `aria-pressed`
     * attribute, so it is recommended to use `onAriaLabel` and `offAriaLabel` instead.
     *
     * If both `ariaLabel` and `onAriaLabel` are set, `onAriaLabel` is used.
     */
    ariaLabel?: LocalizableText;
    /**
     * The aria label that marks the on-state of the button.
     */
    onAriaLabel?: LocalizableText;
    /**
     * The aria label that marks the off-state of the button.
     */
    offAriaLabel?: LocalizableText;
    /**
     * The text as string or as localize callback on the button.
     */
    text?: LocalizableText;
}
/**
 * A button that can be toggled between 'on' and 'off' states.
 *
 * @category Components
 */
export declare class ToggleButton<Config extends ToggleButtonConfig> extends Button<Config> {
    private onState;
    private useAriaPressedAttributeAsToggleIndicator;
    private toggleButtonEvents;
    constructor(config: Config);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    /**
     * Toggles the button to the 'on' state.
     */
    on(): void;
    /**
     * Toggles the button to the 'off' state.
     */
    off(): void;
    /**
     * Toggle the button 'on' if it is 'off', or 'off' if it is 'on'.
     */
    toggle(): void;
    /**
     * Checks if the toggle button is in the 'on' state.
     * @returns {boolean} true if button is 'on', false if 'off'
     */
    isOn(): boolean;
    /**
     * Checks if the toggle button is in the 'off' state.
     * @returns {boolean} true if button is 'off', false if 'on'
     */
    isOff(): boolean;
    protected onClickEvent(): void;
    protected onToggleEvent(): void;
    protected onToggleOnEvent(): void;
    protected onToggleOffEvent(): void;
    /**
     * Gets the event that is fired when the button is toggled.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    get onToggle(): Event<ToggleButton<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the button is toggled 'on'.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    get onToggleOn(): Event<ToggleButton<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the button is toggled 'off'.
     * @returns {Event<ToggleButton<Config>, NoArgs>}
     */
    get onToggleOff(): Event<ToggleButton<Config>, NoArgs>;
}
