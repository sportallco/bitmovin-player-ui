"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentInDirection = getComponentInDirection;
exports.getBoundingRectFromElement = getBoundingRectFromElement;
var types_1 = require("./types");
var FocusableContainer_1 = require("./FocusableContainer");
var toHtmlElement_1 = require("./helper/toHtmlElement");
/**
 * Calculates the length of a vector.
 *
 * @param vector The vector to calculate the length of
 */
function length(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}
/**
 * Normalizes the given vector.
 *
 * @param vector The vector to normalize
 */
function normalize(vector) {
    var len = length(vector);
    return {
        x: vector.x / len,
        y: vector.y / len,
    };
}
/**
 * Calculates the dot product between 2 vectors.
 *
 * @param a The first vector
 * @param b The second vector
 */
function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y;
}
/**
 * Calculates the distance between the 2 points pointed to by the provided vectors.
 *
 * @param a The first vector
 * @param b The second vector
 */
function distance(a, b) {
    return length({
        x: b.x - a.x,
        y: b.y - a.y,
    });
}
/**
 * Returns a vector that corresponds to the center of the provided element.
 *
 * @param element The element to get the center of
 */
function getElementVector(element) {
    var boundingRect = getBoundingRectFromElement(element);
    return {
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height / 2,
    };
}
/**
 * Returns the angle in degrees between the unit vector pointing in the given {Direction} and the unit vector that
 * points from the current element to another element.
 *
 * @param a The vector of the current element
 * @param b The vector of the other element
 * @param direction The direction to move along
 */
function calculateAngle(a, b, direction) {
    var directionVector = {
        x: direction === types_1.Direction.LEFT ? -1 : direction === types_1.Direction.RIGHT ? 1 : 0,
        y: direction === types_1.Direction.UP ? -1 : direction === types_1.Direction.DOWN ? 1 : 0,
    };
    var elementVector = normalize({
        x: b.x - a.x,
        y: b.y - a.y,
    });
    var angleCos = dotProduct(directionVector, elementVector) / (length(directionVector) * length(elementVector));
    return (Math.acos(angleCos) * 180) / Math.PI;
}
/**
 * Returns the best matching element to the current element when trying to navigate in the provided direction. Returns
 * undefined, if there is not element in the given direction.
 *
 * @param activeComponent The currently selected element
 * @param components The list of all elements that can be navigated to
 * @param direction The direction in which to navigate
 */
function getComponentInDirection(activeComponent, components, direction) {
    if (!activeComponent)
        return undefined;
    // We use a cutoff angle of 89 degrees to avoid selecting elements that are in a square angle to the current element.
    var cutoffAngle = 89;
    var activeElement = (0, toHtmlElement_1.toHtmlElement)(activeComponent);
    var activeElemVector = getElementVector(activeElement);
    var availableElements = components
        // Convert components to HTML elements
        .map(function (component) {
        if (component instanceof FocusableContainer_1.FocusableContainer) {
            // Use the whole container's HTML element if it is a FocusableContainer
            return { component: component, element: (0, toHtmlElement_1.toHtmlElement)(component.container) };
        }
        else {
            return { component: component, element: (0, toHtmlElement_1.toHtmlElement)(component) };
        }
    })
        // don't take the current element into account
        .filter(function (_a) {
        var component = _a.component;
        return component !== activeComponent;
    })
        // get the angle between, and distance to any other element from the current element
        .map(function (_a) {
        var element = _a.element, component = _a.component;
        var elementVector = getElementVector(element);
        var dist = distance(activeElemVector, elementVector);
        var angle = calculateAngle(activeElemVector, elementVector, direction);
        return { angle: angle, dist: dist, element: element, component: component };
    })
        // filter out elements that are not in the given direction
        .filter(function (_a) {
        var angle = _a.angle;
        return angle < cutoffAngle;
    });
    var zeroAngleElements = availableElements.filter(function (_a) {
        var angle = _a.angle;
        return angle === 0;
    });
    var sortedElements;
    if (zeroAngleElements.length > 0) {
        sortedElements = zeroAngleElements
            // Favor elements that are in the exact direction of the current element and sort them by distance
            .sort(function (_a, _b) {
            var distA = _a.dist;
            var distB = _b.dist;
            return distA - distB;
        })
            .map(function (_a) {
            var component = _a.component;
            return component;
        });
    }
    else {
        var nonZeroAngleElements = availableElements.filter(function (_a) {
            var angle = _a.angle;
            return angle !== 0;
        });
        sortedElements = nonZeroAngleElements
            // Sort all non-zero elements by distance to the current element
            .sort(function (_a, _b) {
            var distA = _a.dist;
            var distB = _b.dist;
            return distA - distB;
        })
            .map(function (_a) {
            var component = _a.component;
            return component;
        });
    }
    return sortedElements.shift();
}
/**
 * Returns DOMRect like object containing horizontal X and vertical Y coordinates from and HTMLElement.
 * Handles use-cases for getBoundingClientRect when the return type can be either
 * a ClientRect or DOMRect object type.
 *
 * @param element The currently selected element
 */
function getBoundingRectFromElement(element) {
    var boundingRect = element.getBoundingClientRect();
    if (typeof boundingRect.x !== 'number' && typeof boundingRect.y !== 'number') {
        boundingRect.x = boundingRect.left;
        boundingRect.y = boundingRect.top;
    }
    return boundingRect;
}
