"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHtmlElement = toHtmlElement;
/**
 * Returns the HTML elements associated to the provided component.
 *
 * @param component The component to get the HTML elements from
 */
function toHtmlElement(component) {
    return component.getDomElement().get(0);
}
