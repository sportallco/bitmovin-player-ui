"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIUtils = void 0;
var Container_1 = require("../components/Container");
/**
 * @category Utils
 */
var UIUtils;
(function (UIUtils) {
    function traverseTree(component, visit) {
        var recursiveTreeWalker = function (component, parent) {
            visit(component, parent);
            // If the current component is a container, visit it's children
            if (component instanceof Container_1.Container) {
                for (var _i = 0, _a = component.getComponents(); _i < _a.length; _i++) {
                    var childComponent = _a[_i];
                    recursiveTreeWalker(childComponent, component);
                }
            }
        };
        // Walk and configure the component tree
        recursiveTreeWalker(component);
    }
    UIUtils.traverseTree = traverseTree;
    // From: https://github.com/nfriend/ts-keycode-enum/blob/master/Key.enum.ts
    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["LeftArrow"] = 37] = "LeftArrow";
        KeyCode[KeyCode["UpArrow"] = 38] = "UpArrow";
        KeyCode[KeyCode["RightArrow"] = 39] = "RightArrow";
        KeyCode[KeyCode["DownArrow"] = 40] = "DownArrow";
        KeyCode[KeyCode["Space"] = 32] = "Space";
        KeyCode[KeyCode["End"] = 35] = "End";
        KeyCode[KeyCode["Home"] = 36] = "Home";
        KeyCode[KeyCode["Comma"] = 188] = "Comma";
        KeyCode[KeyCode["Period"] = 190] = "Period";
    })(KeyCode = UIUtils.KeyCode || (UIUtils.KeyCode = {}));
})(UIUtils || (exports.UIUtils = UIUtils = {}));
