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
exports.AudioQualitySelectBox = void 0;
var SelectBox_1 = require("./SelectBox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection between 'auto' and the available audio qualities.
 *
 * @category Components
 */
var AudioQualitySelectBox = /** @class */ (function (_super) {
    __extends(AudioQualitySelectBox, _super);
    function AudioQualitySelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-audioqualityselectbox'],
        }, _this.config);
        return _this;
    }
    AudioQualitySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var selectCurrentAudioQuality = function () {
            _this.selectItem(player.getAudioQuality().id);
        };
        var updateAudioQualities = function () {
            var audioQualities = player.getAvailableAudioQualities();
            _this.clearItems();
            // Add entry for automatic quality switching (default setting)
            _this.addItem('auto', i18n_1.i18n.getLocalizer('auto'));
            // Add audio qualities
            for (var _i = 0, audioQualities_1 = audioQualities; _i < audioQualities_1.length; _i++) {
                var audioQuality = audioQualities_1[_i];
                _this.addItem(audioQuality.id, audioQuality.label);
            }
            // Select initial quality
            selectCurrentAudioQuality();
        };
        this.onItemSelectionChanged.subscribe(function (sender, value) {
            player.setAudioQuality(value);
        });
        // Update qualities when audio track has changed
        player.on(player.exports.PlayerEvent.AudioChanged, updateAudioQualities);
        // Update qualities when source goes away
        player.on(player.exports.PlayerEvent.SourceUnloaded, updateAudioQualities);
        // Update qualities when the period within a source changes
        player.on(player.exports.PlayerEvent.PeriodSwitched, updateAudioQualities);
        // Update quality selection when quality is changed (from outside)
        player.on(player.exports.PlayerEvent.AudioQualityChanged, selectCurrentAudioQuality);
        if (player.exports.PlayerEvent.AudioQualityAdded) {
            // Update qualities when their availability changed
            // TODO: remove any cast after next player release
            player.on(player.exports.PlayerEvent.AudioQualityAdded, updateAudioQualities);
            player.on(player.exports.PlayerEvent.AudioQualityRemoved, updateAudioQualities);
        }
        uimanager.getConfig().events.onUpdated.subscribe(updateAudioQualities);
    };
    return AudioQualitySelectBox;
}(SelectBox_1.SelectBox));
exports.AudioQualitySelectBox = AudioQualitySelectBox;
