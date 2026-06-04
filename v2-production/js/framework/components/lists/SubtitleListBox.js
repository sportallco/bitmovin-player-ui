"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleListBox = void 0;
var ListBox_1 = require("./ListBox");
var SubtitleUtils_1 = require("../../utils/SubtitleUtils");
var SubtitleSelectBox_1 = require("../settings/SubtitleSelectBox");
/**
 * An element that is similar to a select box where the user can select a subtitle
 *
 * When a comparator is configured, the built-in "Off" option remains fixed at the top
 * and is not reordered together with the subtitle tracks.
 *
 * @category Components
 */
var SubtitleListBox = /** @class */ (function (_super) {
    __extends(SubtitleListBox, _super);
    function SubtitleListBox(configOrTitle) {
        if (configOrTitle === void 0) { configOrTitle = {}; }
        var config = typeof configOrTitle === 'string' || typeof configOrTitle === 'function'
            ? { title: configOrTitle }
            : configOrTitle;
        return _super.call(this, __assign(__assign({}, config), { listSelector: new SubtitleSelectBox_1.SubtitleSelectBox(config) })) || this;
    }
    SubtitleListBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new SubtitleUtils_1.SubtitleSwitchHandler(player, this.config.listSelector, uimanager);
    };
    return SubtitleListBox;
}(ListBox_1.ListBox));
exports.SubtitleListBox = SubtitleListBox;
