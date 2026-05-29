"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdBreakTracker = void 0;
var EventDispatcher_1 = require("../EventDispatcher");
/**
 * Tracks subsequent ad breaks that share the same `scheduleTime`, enabling a unified ad counter
 * across what the player models as separate ad breaks.
 *
 * When multiple ad breaks are scheduled at the same position, the player fires separate
 * `AdBreakStarted`/`AdBreakFinished` events for each. This tracker retains the ad break objects
 * that the player removes from `player.ads.list()` after they finish, so that
 * {@link currentAdIndex} and {@link totalNumberOfAds} can be derived lazily from the retained
 * breaks plus the player's current state.
 *
 * @category Utils
 */
var AdBreakTracker = /** @class */ (function () {
    function AdBreakTracker(player) {
        var _this = this;
        this.player = player;
        // Ad breaks belonging to the current group, captured as each break starts.
        // The player removes finished breaks from `list()`, so we retain them here.
        this.groupBreaks = [];
        // scheduleTime shared by the current group, or undefined when not in a group.
        this.groupScheduleTime = undefined;
        this.events = {
            onAdCountChanged: new EventDispatcher_1.EventDispatcher(),
        };
        this.handleAdStarted = function () {
            var _a, _b, _c, _d, _e;
            var activeBreak = (_b = (_a = _this.player.ads) === null || _a === void 0 ? void 0 : _a.getActiveAdBreak) === null || _b === void 0 ? void 0 : _b.call(_a);
            if (!activeBreak) {
                _this.reset();
                _this.dispatchChanged();
                return;
            }
            var hasSubsequentBreaks = ((_e = (_d = (_c = _this.player.ads) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d.call(_c)) !== null && _e !== void 0 ? _e : []).some(function (b) { return b.scheduleTime === activeBreak.scheduleTime; });
            var isPartOfExistingGroup = _this.groupBreaks.length > 0 && activeBreak.scheduleTime === _this.groupScheduleTime;
            if (isPartOfExistingGroup || hasSubsequentBreaks) {
                if (!isPartOfExistingGroup && _this.groupBreaks.length > 0) {
                    // New group at a different scheduleTime — clear stale state from a previous group
                    _this.groupBreaks = [];
                }
                _this.groupScheduleTime = activeBreak.scheduleTime;
                // Add the active break if it's not already retained (new break in the group)
                if (!_this.groupBreaks.includes(activeBreak)) {
                    _this.groupBreaks.push(activeBreak);
                }
            }
            else {
                // Single ad break, not part of a group
                _this.groupBreaks = [activeBreak];
                _this.groupScheduleTime = undefined;
            }
            _this.dispatchChanged();
        };
        this.handleAdBreakFinished = function (adBreakFinishedEvent) {
            var _a, _b, _c, _d, _e;
            var adBreak = adBreakFinishedEvent.adBreak;
            if (adBreak.scheduleTime !== _this.groupScheduleTime) {
                if (_this.groupScheduleTime === undefined) {
                    _this.reset();
                    _this.dispatchChanged();
                }
                return;
            }
            var subsequentAdBreaks = ((_c = (_b = (_a = _this.player.ads) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : []).filter(function (b) { return b.scheduleTime === _this.groupScheduleTime; });
            // The next break in the group may already be active (and thus removed from `list()`),
            // so also check whether the currently active break shares the same scheduleTime.
            var activeBreak = (_e = (_d = _this.player.ads) === null || _d === void 0 ? void 0 : _d.getActiveAdBreak) === null || _e === void 0 ? void 0 : _e.call(_d);
            var activeBreakInGroup = (activeBreak === null || activeBreak === void 0 ? void 0 : activeBreak.scheduleTime) === _this.groupScheduleTime && _this.groupScheduleTime !== undefined;
            if (subsequentAdBreaks.length === 0 && !activeBreakInGroup) {
                _this.reset();
                _this.dispatchChanged();
            }
            // When more breaks remain in the group, skip dispatching — the next AdStarted will
            // dispatch up-to-date values. Between breaks there is no active ad, so the lazy
            // getters cannot produce meaningful values.
        };
        // Subsequent ad break detection is done in `AdStarted` because the ad UI variant is not yet configured when
        // the `AdBreakStarted` event fires
        player.on(player.exports.PlayerEvent.AdStarted, this.handleAdStarted);
        player.on(player.exports.PlayerEvent.AdBreakFinished, this.handleAdBreakFinished);
    }
    Object.defineProperty(AdBreakTracker.prototype, "onAdCountChanged", {
        get: function () {
            return this.events.onAdCountChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AdBreakTracker.prototype, "currentAdIndex", {
        /**
         * Index of the currently playing ad across all subsequent ad breaks (1-based), or 0 when no ad
         * is active.
         */
        get: function () {
            var _a, _b, _c, _d, _e;
            var activeAd = (_b = (_a = this.player.ads) === null || _a === void 0 ? void 0 : _a.getActiveAd) === null || _b === void 0 ? void 0 : _b.call(_a);
            if (!activeAd || this.groupBreaks.length === 0) {
                return 0;
            }
            var offset = 0;
            for (var _i = 0, _f = this.groupBreaks; _i < _f.length; _i++) {
                var adBreak = _f[_i];
                var ads = (_c = adBreak.ads) !== null && _c !== void 0 ? _c : [];
                if (ads.length > 0) {
                    // ad.id/activeAd.id may be null/undefined, in which case we fall back to object reference comparison
                    var activeAdIndex = ads.findIndex(function (ad) {
                        return activeAd.id != null && ad.id != null ? ad.id === activeAd.id : ad === activeAd;
                    });
                    if (activeAdIndex >= 0) {
                        return offset + activeAdIndex + 1;
                    }
                    offset += ads.length;
                }
                else {
                    // ads not yet populated — if this is the active break, the active ad is its first ad
                    var activeBreak = (_e = (_d = this.player.ads) === null || _d === void 0 ? void 0 : _d.getActiveAdBreak) === null || _e === void 0 ? void 0 : _e.call(_d);
                    if (activeBreak === adBreak || ((activeBreak === null || activeBreak === void 0 ? void 0 : activeBreak.id) != null && activeBreak.id === adBreak.id)) {
                        return offset + 1;
                    }
                    offset += 1;
                }
            }
            // Active ad not found in any retained break — fall back to offset + 1
            return offset + 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AdBreakTracker.prototype, "totalNumberOfAds", {
        /** Total ad count across all subsequent ad breaks. */
        get: function () {
            var _this = this;
            var _a, _b, _c;
            if (this.groupBreaks.length === 0) {
                return 0;
            }
            // Subsequent ad break ads arrays may not be populated yet (VAST manifests may load lazily), so we use the ads count
            // if available, or assume 1 ad per break if not available. It will update and self-correct with each AdStarted event.
            var retainedCount = this.groupBreaks.reduce(function (sum, adBreak) { var _a; return sum + (((_a = adBreak.ads) === null || _a === void 0 ? void 0 : _a.length) > 0 ? adBreak.ads.length : 1); }, 0);
            var remainingScheduledCount = ((_c = (_b = (_a = this.player.ads) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [])
                .filter(function (b) { return b.scheduleTime === _this.groupScheduleTime; })
                .reduce(function (sum, adBreak) { var _a; return sum + (((_a = adBreak.ads) === null || _a === void 0 ? void 0 : _a.length) > 0 ? adBreak.ads.length : 1); }, 0);
            return retainedCount + remainingScheduledCount;
        },
        enumerable: false,
        configurable: true
    });
    /** Unsubscribes all player events and resets state. Call when the tracker is no longer needed. */
    AdBreakTracker.prototype.release = function () {
        this.player.off(this.player.exports.PlayerEvent.AdStarted, this.handleAdStarted);
        this.player.off(this.player.exports.PlayerEvent.AdBreakFinished, this.handleAdBreakFinished);
        this.reset();
        this.events.onAdCountChanged.unsubscribeAll();
    };
    AdBreakTracker.prototype.dispatchChanged = function () {
        this.events.onAdCountChanged.dispatch(this, {
            currentAdIndex: this.currentAdIndex,
            totalNumberOfAds: this.totalNumberOfAds,
        });
    };
    AdBreakTracker.prototype.reset = function () {
        this.groupBreaks = [];
        this.groupScheduleTime = undefined;
    };
    return AdBreakTracker;
}());
exports.AdBreakTracker = AdBreakTracker;
