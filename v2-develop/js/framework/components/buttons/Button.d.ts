import { ComponentConfig, Component } from '../Component';
import { DOM } from '../../DOM';
import { NoArgs, Event } from '../../EventDispatcher';
import { LocalizableText } from '../../localization/i18n';
/**
 * Configures the style of a {@link Button} component.
 */
export declare enum ButtonStyle {
    /**
     * Only display the button as an icon.
     */
    Icon = "icon",
    /**
     * Only display the button as text.
     */
    Text = "text",
    /**
     * Display the button with an icon and text.
     * The Icon is displayed before the text.
     */
    TextWithLeadingIcon = "text-icon-leading",
    /**
     * Display the button with an icon and text.
     * The Icon is displayed after the text.
     */
    TextWithTrailingIcon = "text-icon-trailing"
}
/**
 * Configuration interface for a {@link Button} component.
 *
 * @category Configs
 */
export interface ButtonConfig extends ComponentConfig {
    /**
     * The text as string or localize callback on the button.
     */
    text?: LocalizableText;
    /**
     * WCAG20 standard for defining info about the component (usually the name)
     */
    ariaLabel?: LocalizableText;
    /**
     * Specifies whether the first touch event received by the {@link UIContainer} should be prevented or not.
     *
     * Default: false
     */
    acceptsTouchWithUiHidden?: boolean;
    /**
     * The style of the button.
     * Default: {@link ButtonStyle.Icon}
     */
    buttonStyle?: ButtonStyle;
}
/**
 * A simple clickable button.
 *
 * @category Components
 */
export declare class Button<Config extends ButtonConfig> extends Component<Config> {
    private static readonly CLASS_TOUCHED;
    private buttonEvents;
    constructor(config: Config);
    protected onLanguageChanged(): void;
    protected toDomElement(): DOM;
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    setText(text: LocalizableText): void;
    protected onClickEvent(): void;
    /**
     * Gets the event that is fired when the button is clicked.
     * @returns {Event<Button<Config>, NoArgs>}
     */
    get onClick(): Event<Button<Config>, NoArgs>;
}
