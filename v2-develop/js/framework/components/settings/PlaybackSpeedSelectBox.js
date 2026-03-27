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
exports.PlaybackSpeedSelectBox = void 0;
var SelectBox_1 = require("./SelectBox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection of different playback speeds.
 *
 * @category Components
 */
var PlaybackSpeedSelectBox = /** @class */ (function (_super) {
    __extends(PlaybackSpeedSelectBox, _super);
    function PlaybackSpeedSelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.defaultPlaybackSpeeds = [0.25, 0.5, 1, 1.5, 2];
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-playbackspeedselectbox'],
        }, _this.config);
        return _this;
    }
    PlaybackSpeedSelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.addDefaultItems();
        this.onItemSelectionChanged.subscribe(function (sender, value) {
            player.setPlaybackSpeed(parseFloat(value));
        });
        var setDefaultValue = function () {
            var playbackSpeed = player.getPlaybackSpeed();
            _this.setSpeed(playbackSpeed);
        };
        player.on(player.exports.PlayerEvent.PlaybackSpeedChanged, setDefaultValue);
        uimanager.getConfig().events.onUpdated.subscribe(setDefaultValue);
    };
    PlaybackSpeedSelectBox.prototype.setSpeed = function (speed) {
        if (!this.selectItem(String(speed))) {
            // a playback speed was set which is not in the list, add it to the list to show it to the user
            this.clearItems();
            this.addDefaultItems([speed]);
            this.selectItem(String(speed));
        }
    };
    PlaybackSpeedSelectBox.prototype.addDefaultItems = function (customItems) {
        var _this = this;
        if (customItems === void 0) { customItems = []; }
        var sortedSpeeds = this.defaultPlaybackSpeeds.concat(customItems).sort();
        sortedSpeeds.forEach(function (element) {
            if (element !== 1) {
                _this.addItem(String(element), "".concat(element, "x"));
            }
            else {
                _this.addItem(String(element), i18n_1.i18n.getLocalizer('normal'));
            }
        });
    };
    PlaybackSpeedSelectBox.prototype.clearItems = function () {
        this.items = [];
        this.selectedItem = null;
    };
    return PlaybackSpeedSelectBox;
}(SelectBox_1.SelectBox));
exports.PlaybackSpeedSelectBox = PlaybackSpeedSelectBox;
