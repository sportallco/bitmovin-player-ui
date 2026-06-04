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
exports.SubtitleSelectBox = void 0;
var SelectBox_1 = require("./SelectBox");
var SubtitleUtils_1 = require("../../utils/SubtitleUtils");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection between available subtitle and caption tracks.
 *
 * When a comparator is configured, the built-in "Off" option remains fixed at the top
 * and is not reordered together with the subtitle tracks.
 *
 * @category Components
 */
var SubtitleSelectBox = /** @class */ (function (_super) {
    __extends(SubtitleSelectBox, _super);
    function SubtitleSelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        var comparator = config.comparator
            ? function (itemA, itemB) {
                if (itemA.key === SubtitleUtils_1.SubtitleSwitchHandler.SUBTITLES_OFF_KEY &&
                    itemB.key === SubtitleUtils_1.SubtitleSwitchHandler.SUBTITLES_OFF_KEY) {
                    return 0;
                }
                if (itemA.key === SubtitleUtils_1.SubtitleSwitchHandler.SUBTITLES_OFF_KEY) {
                    return -1;
                }
                if (itemB.key === SubtitleUtils_1.SubtitleSwitchHandler.SUBTITLES_OFF_KEY) {
                    return 1;
                }
                return config.comparator(itemA, itemB);
            }
            : undefined;
        _this = _super.call(this, __assign(__assign({}, config), { comparator: comparator })) || this;
        _this.config = _this.mergeConfig(__assign(__assign({}, config), { comparator: comparator }), {
            cssClasses: ['ui-subtitleselectbox'],
            ariaLabel: i18n_1.i18n.getLocalizer('subtitle.select'),
        }, _this.config);
        return _this;
    }
    SubtitleSelectBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new SubtitleUtils_1.SubtitleSwitchHandler(player, this, uimanager);
    };
    return SubtitleSelectBox;
}(SelectBox_1.SelectBox));
exports.SubtitleSelectBox = SubtitleSelectBox;
