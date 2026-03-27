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
exports.PlaybackToggleOverlay = void 0;
var Container_1 = require("../Container");
var HugePlaybackToggleButton_1 = require("../buttons/HugePlaybackToggleButton");
/**
 * Overlays the player and displays error messages.
 *
 * @category Components
 */
var PlaybackToggleOverlay = /** @class */ (function (_super) {
    __extends(PlaybackToggleOverlay, _super);
    function PlaybackToggleOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.playbackToggleButton = new HugePlaybackToggleButton_1.HugePlaybackToggleButton({
            enterFullscreenOnInitialPlayback: Boolean(config.enterFullscreenOnInitialPlayback),
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-playbacktoggle-overlay',
            components: [_this.playbackToggleButton],
        }, _this.config);
        return _this;
    }
    return PlaybackToggleOverlay;
}(Container_1.Container));
exports.PlaybackToggleOverlay = PlaybackToggleOverlay;
