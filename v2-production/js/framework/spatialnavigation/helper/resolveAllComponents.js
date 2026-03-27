"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAllComponents = resolveAllComponents;
var TypeGuards_1 = require("../TypeGuards");
/**
 * Recursively resolves a container and the components contained within them, building a flat list of components.
 *
 * @param container The container to get the contained components from
 */
function resolveAllComponents(container) {
    var childComponents = [];
    container.getComponents().forEach(function (containerOrComponent) {
        if ((0, TypeGuards_1.isContainer)(containerOrComponent)) {
            childComponents.push.apply(childComponents, resolveAllComponents(containerOrComponent));
        }
        else if ((0, TypeGuards_1.isComponent)(containerOrComponent)) {
            childComponents.push(containerOrComponent);
        }
    });
    return childComponents;
}
