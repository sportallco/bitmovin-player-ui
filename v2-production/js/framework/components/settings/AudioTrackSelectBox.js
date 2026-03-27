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
exports.AudioTrackSelectBox = void 0;
var SelectBox_1 = require("./SelectBox");
var AudioTrackUtils_1 = require("../../utils/AudioTrackUtils");
/**
 * A select box providing a selection between available audio tracks (e.g. different languages).
 *
 * @category Components
 */
var AudioTrackSelectBox = /** @class */ (function (_super) {
    __extends(AudioTrackSelectBox, _super);
    function AudioTrackSelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-audiotrackselectbox'],
        }, _this.config);
        return _this;
    }
    AudioTrackSelectBox.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        new AudioTrackUtils_1.AudioTrackSwitchHandler(player, this, uimanager);
    };
    return AudioTrackSelectBox;
}(SelectBox_1.SelectBox));
exports.AudioTrackSelectBox = AudioTrackSelectBox;
