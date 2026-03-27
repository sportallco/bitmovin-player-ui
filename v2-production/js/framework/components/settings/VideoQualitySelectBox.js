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
exports.VideoQualitySelectBox = void 0;
var SelectBox_1 = require("./SelectBox");
var i18n_1 = require("../../localization/i18n");
/**
 * A select box providing a selection between 'auto' and the available video qualities.
 *
 * @category Components
 */
var VideoQualitySelectBox = /** @class */ (function (_super) {
    __extends(VideoQualitySelectBox, _super);
    function VideoQualitySelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ui-videoqualityselectbox'],
        }, _this.config);
        return _this;
    }
    VideoQualitySelectBox.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var selectCurrentVideoQuality = function () {
            _this.selectItem(player.getVideoQuality().id);
        };
        var updateVideoQualities = function () {
            var videoQualities = player.getAvailableVideoQualities();
            _this.clearItems();
            // Progressive streams do not support automatic quality selection
            _this.hasAuto = player.getStreamType() !== 'progressive';
            if (_this.hasAuto) {
                // Add entry for automatic quality switching (default setting)
                _this.addItem('auto', i18n_1.i18n.getLocalizer('auto'));
            }
            // Add video qualities
            for (var _i = 0, videoQualities_1 = videoQualities; _i < videoQualities_1.length; _i++) {
                var videoQuality = videoQualities_1[_i];
                _this.addItem(videoQuality.id, videoQuality.label);
            }
            // Select initial quality
            selectCurrentVideoQuality();
        };
        this.onItemSelectionChanged.subscribe(function (sender, value) {
            player.setVideoQuality(value);
        });
        // Update qualities when source goes away
        player.on(player.exports.PlayerEvent.SourceUnloaded, updateVideoQualities);
        // Update qualities when the period within a source changes
        player.on(player.exports.PlayerEvent.PeriodSwitched, updateVideoQualities);
        // Update quality selection when quality is changed (from outside)
        player.on(player.exports.PlayerEvent.VideoQualityChanged, selectCurrentVideoQuality);
        if (player.exports.PlayerEvent.VideoQualityAdded) {
            // Update qualities when their availability changed
            // TODO: remove any cast after next player release
            player.on(player.exports.PlayerEvent.VideoQualityAdded, updateVideoQualities);
            player.on(player.exports.PlayerEvent.VideoQualityRemoved, updateVideoQualities);
        }
        uimanager.getConfig().events.onUpdated.subscribe(updateVideoQualities);
    };
    /**
     * Returns true if the select box contains an 'auto' item for automatic quality selection mode.
     * @return {boolean}
     */
    VideoQualitySelectBox.prototype.hasAutoItem = function () {
        return this.hasAuto;
    };
    return VideoQualitySelectBox;
}(SelectBox_1.SelectBox));
exports.VideoQualitySelectBox = VideoQualitySelectBox;
