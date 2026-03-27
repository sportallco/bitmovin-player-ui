"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerUtils = void 0;
var EventDispatcher_1 = require("../EventDispatcher");
var BrowserUtils_1 = require("./BrowserUtils");
/**
 * @category Utils
 */
var PlayerUtils;
(function (PlayerUtils) {
    var PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["Idle"] = 0] = "Idle";
        PlayerState[PlayerState["Prepared"] = 1] = "Prepared";
        PlayerState[PlayerState["Playing"] = 2] = "Playing";
        PlayerState[PlayerState["Paused"] = 3] = "Paused";
        PlayerState[PlayerState["Finished"] = 4] = "Finished";
    })(PlayerState = PlayerUtils.PlayerState || (PlayerUtils.PlayerState = {}));
    function isTimeShiftAvailable(player) {
        return player.isLive() && player.getMaxTimeShift() !== 0;
    }
    PlayerUtils.isTimeShiftAvailable = isTimeShiftAvailable;
    function getState(player) {
        if (player.hasEnded()) {
            return PlayerState.Finished;
        }
        else if (player.isPlaying()) {
            return PlayerState.Playing;
        }
        else if (player.isPaused()) {
            return PlayerState.Paused;
        }
        else if (player.getSource() != null) {
            return PlayerState.Prepared;
        }
        else {
            return PlayerState.Idle;
        }
    }
    PlayerUtils.getState = getState;
    /**
     * Returns the currentTime - seekableRange.start. This ensures a user-friendly currentTime after a live stream
     * transitioned to VoD.
     * @param player
     */
    function getCurrentTimeRelativeToSeekableRange(player) {
        var currentTime = player.getCurrentTime();
        if (player.isLive()) {
            return currentTime;
        }
        var seekableRangeStart = PlayerUtils.getSeekableRangeStart(player, 0);
        return currentTime - seekableRangeStart;
    }
    PlayerUtils.getCurrentTimeRelativeToSeekableRange = getCurrentTimeRelativeToSeekableRange;
    /**
     * Returns the start value of the seekable range or the defaultValue if no seekableRange is present.
     * For now this happens only in combination with Mobile SDKs.
     *
     * TODO: remove this function in next major release
     *
     * @param player
     * @param defaultValue
     */
    function getSeekableRangeStart(player, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return (player.getSeekableRange() && player.getSeekableRange().start) || defaultValue;
    }
    PlayerUtils.getSeekableRangeStart = getSeekableRangeStart;
    /**
     * Calculates player seekable time range for live.
     * As the player returns `{ start: -1, end: -1 }` for live streams we need to calculate the `seekableRange` based on `maxTimeshift`.
     *
     * @param player
     */
    function getSeekableRangeRespectingLive(player) {
        if (!player.isLive()) {
            return player.getSeekableRange();
        }
        var currentTimeshift = -player.getTimeShift();
        var maxTimeshift = -player.getMaxTimeShift();
        var currentTime = player.getCurrentTime();
        var end = currentTime + currentTimeshift;
        var start = currentTime - (maxTimeshift - currentTimeshift);
        return { start: start, end: end };
    }
    PlayerUtils.getSeekableRangeRespectingLive = getSeekableRangeRespectingLive;
    var TimeShiftAvailabilityDetector = /** @class */ (function () {
        function TimeShiftAvailabilityDetector(player) {
            var _this = this;
            this.timeShiftAvailabilityChangedEvent = new EventDispatcher_1.EventDispatcher();
            this.player = player;
            this.timeShiftAvailable = undefined;
            var timeShiftDetector = function () {
                _this.detect();
            };
            // Try to detect timeshift availability when source is loaded, which works for DASH streams
            player.on(player.exports.PlayerEvent.SourceLoaded, timeShiftDetector);
            // With HLS/NativePlayer streams, getMaxTimeShift can be 0 before the buffer fills, so we need to additionally
            // check timeshift availability in TimeChanged
            player.on(player.exports.PlayerEvent.TimeChanged, timeShiftDetector);
        }
        TimeShiftAvailabilityDetector.prototype.detect = function () {
            if (this.player.isLive()) {
                var timeShiftAvailableNow = PlayerUtils.isTimeShiftAvailable(this.player);
                // When the availability changes, we fire the event
                if (timeShiftAvailableNow !== this.timeShiftAvailable) {
                    this.timeShiftAvailabilityChangedEvent.dispatch(this.player, { timeShiftAvailable: timeShiftAvailableNow });
                    this.timeShiftAvailable = timeShiftAvailableNow;
                }
            }
        };
        Object.defineProperty(TimeShiftAvailabilityDetector.prototype, "onTimeShiftAvailabilityChanged", {
            get: function () {
                return this.timeShiftAvailabilityChangedEvent.getEvent();
            },
            enumerable: false,
            configurable: true
        });
        return TimeShiftAvailabilityDetector;
    }());
    PlayerUtils.TimeShiftAvailabilityDetector = TimeShiftAvailabilityDetector;
    /**
     * Detects changes of the stream type, i.e. changes of the return value of the player#isLive method.
     * Normally, a stream cannot change its type during playback, it's either VOD or live. Due to bugs on some
     * platforms or browsers, it can still change. It is therefore unreliable to just check #isLive and this detector
     * should be used as a workaround instead.
     *
     * Additionally starting with player v8.19.0 we have the use-case that a live stream changes into a vod.
     * The DurationChanged event indicates this switch.
     *
     * Known cases:
     *
     * - HLS VOD on Android 4.3
     * Video duration is initially 'Infinity' and only gets available after playback starts, so streams are wrongly
     * reported as 'live' before playback (the live-check in the player checks for infinite duration).
     *
     * @deprecated since UI v3.9.0 in combination with player v8.19.0 use PlayerEvent.DurationChanged instead
     *
     * TODO: remove this class in next major release
     */
    var LiveStreamDetector = /** @class */ (function () {
        function LiveStreamDetector(player, uimanager) {
            var _this = this;
            this.liveChangedEvent = new EventDispatcher_1.EventDispatcher();
            this.player = player;
            this.uimanager = uimanager;
            this.live = undefined;
            var liveDetector = function () {
                _this.detect();
            };
            this.uimanager.getConfig().events.onUpdated.subscribe(liveDetector);
            // Re-evaluate when playback starts
            player.on(player.exports.PlayerEvent.Play, liveDetector);
            // HLS live detection workaround for Android:
            // Also re-evaluate during playback, because that is when the live flag might change.
            // (Doing it only in Android Chrome saves unnecessary overhead on other platforms)
            if (BrowserUtils_1.BrowserUtils.isAndroid && BrowserUtils_1.BrowserUtils.isChrome) {
                player.on(player.exports.PlayerEvent.TimeChanged, liveDetector);
            }
            // DurationChanged event was introduced with player v8.19.0
            if (player.exports.PlayerEvent.DurationChanged) {
                player.on(player.exports.PlayerEvent.DurationChanged, liveDetector);
            }
            // Ad video's isLive() might be different than the actual video's isLive().
            player.on(player.exports.PlayerEvent.AdBreakStarted, liveDetector);
            player.on(player.exports.PlayerEvent.AdBreakFinished, liveDetector);
        }
        LiveStreamDetector.prototype.detect = function () {
            var liveNow = this.player.isLive();
            // Compare current to previous live state flag and fire event when it changes. Since we initialize the flag
            // with undefined, there is always at least an initial event fired that tells listeners the live state.
            if (liveNow !== this.live) {
                this.liveChangedEvent.dispatch(this.player, { live: liveNow });
                this.live = liveNow;
            }
        };
        Object.defineProperty(LiveStreamDetector.prototype, "onLiveChanged", {
            get: function () {
                return this.liveChangedEvent.getEvent();
            },
            enumerable: false,
            configurable: true
        });
        return LiveStreamDetector;
    }());
    PlayerUtils.LiveStreamDetector = LiveStreamDetector;
    function clampValueToRange(value, boundary1, boundary2) {
        var lowerBoundary = Math.min(boundary1, boundary2);
        var upperBoundary = Math.max(boundary1, boundary2);
        return Math.min(Math.max(value, lowerBoundary), upperBoundary);
    }
    PlayerUtils.clampValueToRange = clampValueToRange;
})(PlayerUtils || (exports.PlayerUtils = PlayerUtils = {}));
