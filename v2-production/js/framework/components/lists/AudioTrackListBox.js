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
exports.AudioTrackListBox = void 0;
var ListBox_1 = require("./ListBox");
var AudioTrackUtils_1 = require("../../utils/AudioTrackUtils");
var AudioTrackSelectBox_1 = require("../settings/AudioTrackSelectBox");
/**
 * An element that is similar to a select box where the user can select an audio track
 *
 * @category Components
 */
var AudioTrackListBox = /** @class */ (function (_super) {
    __extends(AudioTrackListBox, _super);
    function AudioTrackListBox(configOrTitle) {
        if (configOrTitle === void 0) { configOrTitle = {}; }
        var config = typeof configOrTitle === 'string' || typeof configOrTitle === 'function'
            ? { title: configOrTitle }
            : configOrTitle;
        return _super.call(this, __assign(__assign({}, config), { listSelector: new AudioTrackSelectBox_1.AudioTrackSelectBox(config) })) || this;
    }
    AudioTrackListBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new AudioTrackUtils_1.AudioTrackSwitchHandler(player, this.config.listSelector, uimanager);
    };
    return AudioTrackListBox;
}(ListBox_1.ListBox));
exports.AudioTrackListBox = AudioTrackListBox;
