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
exports.RecommendationItem = void 0;
var Component_1 = require("./Component");
var EventDispatcher_1 = require("../EventDispatcher");
var DOM_1 = require("../DOM");
var Label_1 = require("./labels/Label");
var StringUtils_1 = require("../utils/StringUtils");
/**
 * An item of the {@link RecommendationOverlay}.
 */
var RecommendationItem = /** @class */ (function (_super) {
    __extends(RecommendationItem, _super);
    function RecommendationItem(config) {
        var _this = _super.call(this, config) || this;
        _this.events = {
            onClick: new EventDispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-recommendation-item',
            recommendationConfig: null, // this must be passed in from outside
            tabIndex: 0,
        }, _this.config);
        return _this;
    }
    RecommendationItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        if (isExternalRecommendationLink(this.config.recommendationConfig.resource)) {
            return;
        }
        this.onClick.subscribe(function () {
            player.load(_this.config.recommendationConfig.resource);
            player.play();
        });
    };
    RecommendationItem.prototype.toDomElement = function () {
        var _this = this;
        var recommendationConfig = this.config.recommendationConfig;
        var recommendationResource = recommendationConfig.resource;
        var tagName;
        var additionalAttributes = {};
        var posterUrl;
        if (isExternalRecommendationLink(recommendationResource)) {
            tagName = 'a';
            additionalAttributes = { href: recommendationResource.url };
            posterUrl = recommendationResource.thumbnail;
        }
        else {
            tagName = 'button';
            posterUrl = recommendationResource.poster;
        }
        var itemElement = new DOM_1.DOM(tagName, __assign(__assign({ id: this.config.id, class: this.getCssClasses() }, additionalAttributes), { tabindex: this.config.tabIndex.toString() }), this);
        if (posterUrl) {
            itemElement.css({ 'background-image': "url(\"".concat(posterUrl, "\")") });
        }
        var titleElement = new DOM_1.DOM('div', {
            class: this.prefixCss('title-container'),
        }, this);
        var innerTitleElement = new Label_1.Label({ text: recommendationConfig.title, cssClass: 'title' });
        titleElement.append(innerTitleElement.getDomElement());
        itemElement.append(titleElement);
        if (recommendationConfig.duration != null) {
            var timeElement = new Label_1.Label({
                text: recommendationConfig.duration ? StringUtils_1.StringUtils.secondsToTime(recommendationConfig.duration) : '',
                cssClass: 'duration',
            });
            itemElement.append(timeElement.getDomElement());
        }
        if (!isExternalRecommendationLink(recommendationResource)) {
            // Only add click handler if it's not a link already and we need to load a new source
            itemElement.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.onClickEvent();
            });
        }
        return itemElement;
    };
    RecommendationItem.prototype.onClickEvent = function () {
        this.events.onClick.dispatch(this);
    };
    Object.defineProperty(RecommendationItem.prototype, "onClick", {
        get: function () {
            return this.events.onClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return RecommendationItem;
}(Component_1.Component));
exports.RecommendationItem = RecommendationItem;
function isExternalRecommendationLink(obj) {
    return 'url' in obj;
}
