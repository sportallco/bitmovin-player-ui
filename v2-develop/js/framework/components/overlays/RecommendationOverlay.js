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
exports.RecommendationOverlay = void 0;
var Container_1 = require("../Container");
var HugeReplayButton_1 = require("../buttons/HugeReplayButton");
var RecommendationItem_1 = require("../RecommendationItem");
/**
 * Overlays the player and displays recommended videos.
 *
 * @category Containers
 */
var RecommendationOverlay = /** @class */ (function (_super) {
    __extends(RecommendationOverlay, _super);
    function RecommendationOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.replayButton = new HugeReplayButton_1.HugeReplayButton();
        _this.recommendationContainer = new Container_1.Container({
            components: [],
            cssClasses: ['recommendation-overlay-row', 'recommendations-section'],
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-overlay',
            hidden: true,
            components: [
                new Container_1.Container({
                    components: [_this.replayButton, _this.recommendationContainer],
                    cssClasses: ['recommendation-overlay-row', 'replay-section'],
                }),
            ],
        }, _this.config);
        return _this;
    }
    RecommendationOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var clearRecommendations = function () {
            _this.recommendationContainer.removeComponents();
            _this.recommendationContainer.updateComponents();
            _this.getDomElement().removeClass(_this.prefixCss(RecommendationOverlay.CLASS_HAS_RECOMMENDATIONS));
        };
        var setupRecommendations = function () {
            clearRecommendations();
            var recommendations = uimanager.getConfig().metadata.recommendations;
            if (recommendations.length == 0) {
                return;
            }
            var index = 1;
            recommendations.forEach(function (recommendationConfig) {
                var recommendationItem = new RecommendationItem_1.RecommendationItem({
                    recommendationConfig: recommendationConfig,
                    cssClasses: ['recommendation-item-' + index++],
                });
                recommendationItem.configure(player, uimanager);
                _this.recommendationContainer.addComponent(recommendationItem);
            });
            _this.recommendationContainer.updateComponents();
            _this.getDomElement().addClass(_this.prefixCss(RecommendationOverlay.CLASS_HAS_RECOMMENDATIONS));
        };
        uimanager.getConfig().events.onUpdated.subscribe(setupRecommendations);
        // Remove recommendations and hide overlay when source is unloaded
        player.on(player.exports.PlayerEvent.SourceUnloaded, function () {
            clearRecommendations();
            _this.hide();
        });
        // Display recommendations when playback has finished
        player.on(player.exports.PlayerEvent.PlaybackFinished, function () {
            _this.show();
        });
        // Hide recommendations when playback starts, e.g. a restart
        player.on(player.exports.PlayerEvent.Play, function () {
            _this.hide();
        });
        // Init on startup
        setupRecommendations();
    };
    RecommendationOverlay.CLASS_HAS_RECOMMENDATIONS = 'recommendations';
    return RecommendationOverlay;
}(Container_1.Container));
exports.RecommendationOverlay = RecommendationOverlay;
