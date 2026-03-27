"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSettingsPanel = isSettingsPanel;
exports.isComponent = isComponent;
exports.isContainer = isContainer;
exports.isDirection = isDirection;
exports.isAction = isAction;
exports.isFocusable = isFocusable;
var Component_1 = require("../components/Component");
var SettingsPanel_1 = require("../components/settings/SettingsPanel");
var Container_1 = require("../components/Container");
var types_1 = require("./types");
var FocusableContainer_1 = require("./FocusableContainer");
function isSettingsPanel(component) {
    return component instanceof SettingsPanel_1.SettingsPanel;
}
function isComponent(obj) {
    return obj !== null && obj !== undefined && obj instanceof Component_1.Component;
}
function isContainer(obj) {
    return obj !== null && obj !== undefined && obj instanceof Container_1.Container;
}
function isDirection(direction) {
    return typeof direction === 'string' && Object.values(types_1.Direction).includes(direction);
}
function isAction(action) {
    return typeof action === 'string' && Object.values(types_1.Action).includes(action);
}
function isFocusable(component) {
    if (component instanceof FocusableContainer_1.FocusableContainer) {
        return true;
    }
    return component.isShown() && component.getConfig().tabIndex >= 0;
}
