import { Component, ComponentConfig } from './components/Component';
export interface Offset {
    left: number;
    top: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface CssProperties {
    [propertyName: string]: string;
}
/**
 * Extends the {@link HTMLElement} interface with a component attribute to store the associated component.
 */
export interface HTMLElementWithComponent extends HTMLElement {
    component?: Component<ComponentConfig>;
}
/**
 * Simple DOM manipulation and DOM element event handling modeled after jQuery (as replacement for jQuery).
 *
 * Like jQuery, DOM operates on single elements and lists of elements. For example: creating an element returns a DOM
 * instance with a single element, selecting elements returns a DOM instance with zero, one, or many elements. Similar
 * to jQuery, setters usually affect all elements, while getters operate on only the first element.
 * Also similar to jQuery, most methods (except getters) return the DOM instance facilitating easy chaining of method
 * calls.
 *
 * Built with the help of: http://youmightnotneedjquery.com/
 */
export declare class DOM {
    private readonly documentOrShadowRoot;
    /**
     * The list of elements that the instance wraps. Take care that not all methods can operate on the whole list,
     * getters usually just work on the first element.
     */
    private elements;
    /**
     * Creates a DOM element.
     * @param tagName the tag name of the DOM element
     * @param attributes a list of attributes of the element
     * @param component the {@link Component} the DOM element is associated with
     */
    constructor(tagName: string, attributes: {
        [name: string]: string;
    }, component?: Component<ComponentConfig>);
    /**
     * Selects all elements from the DOM that match the specified selector.
     * @param selector the selector to match DOM elements with
     */
    constructor(selector: string);
    /**
     * Wraps a plain HTMLElement with a DOM instance.
     * @param element the HTMLElement to wrap with DOM
     */
    constructor(element: HTMLElement);
    /**
     * Wraps a list of plain HTMLElements with a DOM instance.
     * @param elements the HTMLElements to wrap with DOM
     */
    constructor(elements: HTMLElement[]);
    /**
     * Wraps the document with a DOM instance. Useful to attach event listeners to the document.
     * @param document the document to wrap
     */
    constructor(document: Document);
    /**
     * Wraps the ShadowRoot with a DOM instance. Useful to attach event listeners to the ShadowRoot.
     * @param shadowRoot the ShadowRoot to wrap
     */
    constructor(shadowRoot: ShadowRoot);
    /**
     * Gets the number of elements that this DOM instance currently holds.
     * @returns {number} the number of elements
     */
    get length(): number;
    /**
     * Gets the HTML elements that this DOM instance currently holds.
     * @returns {HTMLElement[]} the raw HTML elements
     */
    get(): HTMLElementWithComponent[];
    /**
     * Gets an HTML element from the list elements that this DOM instance currently holds.
     * @param index The zero-based index into the element list. Can be negative to return an element from the end,
     *    e.g. -1 returns the last element.
     */
    get(index: number): HTMLElementWithComponent;
    /**
     * A shortcut method for iterating all elements. Shorts this.elements.forEach(...) to this.forEach(...).
     * @param handler the handler to execute an operation on an element
     */
    private forEach;
    private findChildElementsOfElement;
    private findChildElements;
    /**
     * Finds all child elements of all elements matching the supplied selector.
     * @param selector the selector to match with child elements
     * @returns {DOM} a new DOM instance representing all matched children
     */
    find(selector: string): DOM;
    /**
     * Focuses to the first input element
     */
    focusToFirstInput(): void;
    /**
     * Focuses to the first input element
     */
    scrollTo(x: number, y: number): void;
    /**
     * Returns a string of the inner HTML content of the first element.
     */
    html(): string;
    /**
     * Sets the inner HTML content of all elements.
     * @param content a string of plain text or HTML markup
     */
    html(content: string): DOM;
    private getHtml;
    private setHtml;
    /**
     * Clears the inner HTML of all elements (deletes all children).
     * @returns {DOM}
     */
    empty(): DOM;
    /**
     * Returns the current value of the first form element, e.g. the selected value of a select box or the text if an
     * input field.
     * @returns {string} the value of a form element
     */
    val(): string;
    /**
     * Returns the value of an attribute on the first element.
     * @param attribute
     */
    attr(attribute: string): string | null;
    /**
     * Sets an attribute on all elements.
     * @param attribute the name of the attribute
     * @param value the value of the attribute
     */
    attr(attribute: string, value: string): DOM;
    /**
     * Removes the attribute of the element.
     * @param attribute
     */
    removeAttr(attribute: string): void;
    private getAttr;
    private setAttr;
    /**
     * Returns the value of a data element on the first element.
     * @param dataAttribute the name of the data attribute without the 'data-' prefix
     */
    data(dataAttribute: string): string | null;
    /**
     * Sets a data attribute on all elements.
     * @param dataAttribute the name of the data attribute without the 'data-' prefix
     * @param value the value of the data attribute
     */
    data(dataAttribute: string, value: string): DOM;
    private getData;
    private setData;
    /**
     * Appends one or more DOM elements as children to all elements.
     * @param childElements the child elements to append
     * @returns {DOM}
     */
    append(...childElements: DOM[]): DOM;
    /**
     * Prepends one or more DOM elements as children to all elements.
     * @param childElements the child elements to prepend
     * @returns {DOM}
     */
    prepend(...childElements: DOM[]): DOM;
    /**
     * Removes all elements from the DOM.
     */
    remove(): void;
    /**
     * Returns the offset of the first element from the document's top left corner.
     * @returns {Offset}
     */
    offset(): Offset;
    /**
     * Returns the width of the first element.
     * @returns {number} the width of the first element
     */
    width(): number;
    /**
     * Returns the height of the first element.
     * @returns {number} the height of the first element
     */
    height(): number;
    /**
     * Returns the size of the first element.
     * @return {Size} the size of the first element
     */
    size(): Size;
    /**
     * Attaches an event handler to one or more events on all elements.
     * @param eventName the event name (or multiple names separated by space) to listen to
     * @param eventHandler the event handler to call when the event fires
     * @param options the options for this event handler
     * @returns {DOM}
     */
    on(eventName: string, eventHandler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): DOM;
    /**
     * Removes an event handler from one or more events on all elements.
     * @param eventName the event name (or multiple names separated by space) to remove the handler from
     * @param eventHandler the event handler to remove
     * @param options the options for this event handler
     * @returns {DOM}
     */
    off(eventName: string, eventHandler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): DOM;
    /**
     * Adds the specified class(es) to all elements.
     * @param className the class(es) to add, multiple classes separated by space
     * @returns {DOM}
     */
    addClass(className: string): DOM;
    /**
     * Removed the specified class(es) from all elements.
     * @param className the class(es) to remove, multiple classes separated by space
     * @returns {DOM}
     */
    removeClass(className: string): DOM;
    /**
     * Checks if any of the elements has the specified class.
     * @param className the class name to check
     * @returns {boolean} true if one of the elements has the class attached, else if no element has it attached
     */
    hasClass(className: string): boolean;
    /**
     * Returns the value of a CSS property of the first element.
     * @param propertyName the name of the CSS property to retrieve the value of
     */
    css(propertyName: string): string | null;
    /**
     * Sets the value of a CSS property on all elements.
     * @param propertyName the name of the CSS property to set the value for
     * @param value the value to set for the given CSS property
     */
    css(propertyName: string, value: string): DOM;
    /**
     * Sets a collection of CSS properties and their values on all elements.
     * @param propertyValueCollection an object containing pairs of property names and their values
     */
    css(propertyValueCollection: CssProperties): DOM;
    /**
     * Removes an inline CSS property if it exists
     * @param propertyName name of the property to remove
     * @param elementIndex index of the element whose CSS property should get removed
     */
    removeCss(propertyName: string, elementIndex?: number): string;
    private getCss;
    private setCss;
    private setCssCollection;
}
