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
exports.RecommendationOverlayNavigationGroup = void 0;
var NavigationGroup_1 = require("./NavigationGroup");
var FocusableContainer_1 = require("./FocusableContainer");
var RecommendationOverlayNavigationGroup = /** @class */ (function (_super) {
    __extends(RecommendationOverlayNavigationGroup, _super);
    function RecommendationOverlayNavigationGroup(recommendationOverlay) {
        var _this = _super.call(this, recommendationOverlay, recommendationOverlay.replayButton, new FocusableContainer_1.FocusableContainer(recommendationOverlay.recommendationContainer)) || this;
        _this.recommendationOverlay = recommendationOverlay;
        return _this;
    }
    RecommendationOverlayNavigationGroup.prototype.getComponents = function () {
        var hasRecommendations = this.recommendationOverlay.recommendationContainer.getComponents().length > 0;
        if (hasRecommendations) {
            return _super.prototype.getComponents.call(this);
        }
        else {
            // In case we have no recommendations, we only want to be able to focus the replay button and don't allow
            // navigating to the (empty) recommendation container.
            return [this.recommendationOverlay.replayButton];
        }
    };
    return RecommendationOverlayNavigationGroup;
}(NavigationGroup_1.NavigationGroup));
exports.RecommendationOverlayNavigationGroup = RecommendationOverlayNavigationGroup;
