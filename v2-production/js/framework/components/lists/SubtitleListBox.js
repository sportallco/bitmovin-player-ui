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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleListBox = void 0;
var ListBox_1 = require("./ListBox");
var SubtitleUtils_1 = require("../../utils/SubtitleUtils");
var SubtitleSelectBox_1 = require("../settings/SubtitleSelectBox");
/**
 * A element that is similar to a select box where the user can select a subtitle
 *
 * @category Components
 */
var SubtitleListBox = /** @class */ (function (_super) {
    __extends(SubtitleListBox, _super);
    function SubtitleListBox(title) {
        return _super.call(this, {
            listSelector: new SubtitleSelectBox_1.SubtitleSelectBox(),
            title: title,
        }) || this;
    }
    SubtitleListBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new SubtitleUtils_1.SubtitleSwitchHandler(player, this.config.listSelector, uimanager);
    };
    return SubtitleListBox;
}(ListBox_1.ListBox));
exports.SubtitleListBox = SubtitleListBox;
