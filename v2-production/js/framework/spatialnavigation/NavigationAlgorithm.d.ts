import { AnyComponent, Direction, Focusable } from './types';
/**
 * Returns the best matching element to the current element when trying to navigate in the provided direction. Returns
 * undefined, if there is not element in the given direction.
 *
 * @param activeComponent The currently selected element
 * @param components The list of all elements that can be navigated to
 * @param direction The direction in which to navigate
 */
export declare function getComponentInDirection(activeComponent: AnyComponent, components: Focusable[], direction: Direction): Focusable | undefined;
/**
 * Returns DOMRect like object containing horizontal X and vertical Y coordinates from and HTMLElement.
 * Handles use-cases for getBoundingClientRect when the return type can be either
 * a ClientRect or DOMRect object type.
 *
 * @param element The currently selected element
 */
export declare function getBoundingRectFromElement(element: HTMLElement): DOMRect;
