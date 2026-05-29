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
exports.AdCounterLabel = void 0;
var i18n_1 = require("../../localization/i18n");
var Label_1 = require("../labels/Label");
var StringUtils_1 = require("../../utils/StringUtils");
/**
 * A label that displays the index of the currently playing ad out of the total number of ads.
 *
 * @category Labels
 */
var AdCounterLabel = /** @class */ (function (_super) {
    __extends(AdCounterLabel, _super);
    function AdCounterLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.adBreakTrackerAdCountChangedHandler = function (_, adBreakTrackerEvent) {
            _this.setAdCounterFromAdBreakTracker(adBreakTrackerEvent.currentAdIndex, adBreakTrackerEvent.totalNumberOfAds);
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label-ad-counter',
            adCountOutOfTotal: i18n_1.i18n.getLocalizer('ads.adNumberOfTotal'),
        }, _this.config);
        return _this;
    }
    AdCounterLabel.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        this.adBreakTracker = uimanager.getConfig().adBreakTracker;
        this.adBreakTracker.onAdCountChanged.subscribe(this.adBreakTrackerAdCountChangedHandler);
        // An ad break may already be ongoing when configure is called, in this case the onAdCountChanged event was missed
        // and the label is set here
        if (this.adBreakTracker.currentAdIndex > 0 && this.adBreakTracker.totalNumberOfAds > 0) {
            this.setAdCounterFromAdBreakTracker(this.adBreakTracker.currentAdIndex, this.adBreakTracker.totalNumberOfAds);
        }
    };
    AdCounterLabel.prototype.release = function () {
        var _a;
        (_a = this.adBreakTracker) === null || _a === void 0 ? void 0 : _a.onAdCountChanged.unsubscribe(this.adBreakTrackerAdCountChangedHandler);
        this.adBreakTracker = undefined;
        this.player = undefined;
        _super.prototype.release.call(this);
    };
    AdCounterLabel.prototype.onLanguageChanged = function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = this.adBreakTracker) === null || _a === void 0 ? void 0 : _a.currentAdIndex) > 0 || ((_d = (_c = (_b = this.player) === null || _b === void 0 ? void 0 : _b.ads) === null || _c === void 0 ? void 0 : _c.isLinearAdActive) === null || _d === void 0 ? void 0 : _d.call(_c))) {
            this.setAdCounterFromAdBreakTracker((_e = this.adBreakTracker) === null || _e === void 0 ? void 0 : _e.currentAdIndex, (_f = this.adBreakTracker) === null || _f === void 0 ? void 0 : _f.totalNumberOfAds);
        }
    };
    AdCounterLabel.prototype.setAdCounterFromAdBreakTracker = function (currentAdIndex, totalNumberOfAds) {
        if (currentAdIndex === 0 && totalNumberOfAds === 0) {
            // No ad break active and no subsequent ad breaks
            this.setText('');
            return;
        }
        this.setText(StringUtils_1.StringUtils.replaceAdMessagePlaceholders(i18n_1.i18n.performLocalization(this.config.adCountOutOfTotal), this.player, undefined, currentAdIndex, totalNumberOfAds));
    };
    return AdCounterLabel;
}(Label_1.Label));
exports.AdCounterLabel = AdCounterLabel;
