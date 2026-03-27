import { ComponentConfig, Component } from '../Component';
import { DOM } from '../../DOM';
import { Event, NoArgs } from '../../EventDispatcher';
import { LocalizableText } from '../../localization/i18n';
export declare enum LabelStyle {
    /**
     * Only display the label text.
     */
    Text = "text",
    /**
     * Display the label with an icon and text.
     * The Icon is displayed before the text.
     */
    TextWithLeadingIcon = "text-icon-leading",
    /**
     * Display the label with an icon and text.
     * The Icon is displayed after the text.
     */
    TextWithTrailingIcon = "text-icon-trailing"
}
/**
 * Configuration interface for a {@link Label} component.
 *
 * @category Configs
 */
export interface LabelConfig extends ComponentConfig {
    /**
     * The text as string or localize callback on the label.
     */
    text?: LocalizableText;
    /**
     * WCAG20 standard: Associate label to form control.
     */
    for?: string;
    /**
     * The style of the label.
     * Default: {@link LabelStyle.Text}
     */
    labelStyle?: LabelStyle;
}
/**
 * A text label with optional icon.
 *
 * DOM example:
 * <code>
 *     <span class='ui-label'>
 *         <span class='ui-label-text'>...some text...</span>
 *     </span>
 * </code>
 *
 * @category Components
 */
export declare class Label<Config extends LabelConfig> extends Component<Config> {
    private text;
    private textElement;
    private labelEvents;
    constructor(config?: Config);
    protected onLanguageChanged(): void;
    protected toDomElement(): DOM;
    /**
     * Set the text on this label.
     * @param text
     */
    setText(text: LocalizableText): void;
    /**
     * Gets the text on this label.
     * @return {string} The text on the label
     */
    getText(): string;
    /**
     * Clears the text on this label.
     */
    clearText(): void;
    /**
     * Tests if the label is empty and does not contain any text.
     * @return {boolean} True if the label is empty, else false
     */
    isEmpty(): boolean;
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    protected onClickEvent(): void;
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    protected onTextChangedEvent(text: string): void;
    /**
     * Gets the event that is fired when the label is clicked.
     * @returns {Event<Label<LabelConfig>, NoArgs>}
     */
    get onClick(): Event<Label<LabelConfig>, NoArgs>;
    /**
     * Gets the event that is fired when the text on the label is changed.
     * @returns {Event<Label<LabelConfig>, string>}
     */
    get onTextChanged(): Event<Label<LabelConfig>, string>;
}
