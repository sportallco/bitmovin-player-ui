"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInsightProperty = exports.PlayerInsightsProvider = void 0;
var EventDispatcher_1 = require("../EventDispatcher");
var Timeout_1 = require("./Timeout");
var PlayerInsightsUtils_1 = require("./PlayerInsightsUtils");
var PlayerInsightsProvider = /** @class */ (function () {
    function PlayerInsightsProvider() {
        var _this = this;
        this.properties = {
            video: new PlayerInsightProperty('Video', function (player) { return PlayerInsightsUtils_1.PlayerInsightsUtils.formatVideoQualityInsight(player); }),
            viewportFrames: new PlayerInsightProperty('Viewport / Frames', function (player) {
                return PlayerInsightsUtils_1.PlayerInsightsUtils.formatViewportFramesInsight(player);
            }),
            audio: new PlayerInsightProperty('Audio', function (player) { return PlayerInsightsUtils_1.PlayerInsightsUtils.formatAudioQualityInsight(player); }),
            bufferVideoAudio: new PlayerInsightProperty('Buffer Video / Audio', function (player) {
                return PlayerInsightsUtils_1.PlayerInsightsUtils.formatBufferInsight(player);
            }),
            time: new PlayerInsightProperty('Time', function (player) { return PlayerInsightsUtils_1.PlayerInsightsUtils.formatTimeInsight(player); }),
            stream: new PlayerInsightProperty('Stream', function (player) { return PlayerInsightsUtils_1.PlayerInsightsUtils.formatStreamInsight(player); }),
            player: new PlayerInsightProperty('Player version', function (player) { return player.version; }),
        };
        this.events = {
            onChanged: new EventDispatcher_1.EventDispatcher(),
        };
        this.playerApi = null;
        this.uimanager = null;
        this.refreshTimer = null;
        this.refreshIntervalMs = 1000;
        this.active = false;
        this.updateAndStartTimer = function () {
            _this.dispatchChanged();
            _this.startTimer();
        };
        this.dispatchChanged = function () {
            if (!_this.active || !_this.playerApi) {
                return;
            }
            _this.events.onChanged.dispatch(_this, _this.getSnapshots(_this.playerApi));
        };
        this.stopTimer = function () {
            if (_this.refreshTimer) {
                _this.refreshTimer.clear();
                _this.refreshTimer = null;
            }
        };
    }
    PlayerInsightsProvider.prototype.getInsights = function () {
        var insights = [];
        for (var propertyName in this.properties) {
            insights.push(this.properties[propertyName]);
        }
        return insights;
    };
    PlayerInsightsProvider.prototype.initialize = function (player, uimanager, refreshIntervalMs) {
        this.playerApi = player;
        this.uimanager = uimanager;
        this.refreshIntervalMs = refreshIntervalMs;
        player.on(player.exports.PlayerEvent.Play, this.updateAndStartTimer);
        player.on(player.exports.PlayerEvent.Playing, this.updateAndStartTimer);
        player.on(player.exports.PlayerEvent.Paused, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.Seeked, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.SourceLoaded, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.SourceUnloaded, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.VideoQualityChanged, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.AudioQualityChanged, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.PlayerResized, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.StallStarted, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.StallEnded, this.dispatchChanged);
        player.on(player.exports.PlayerEvent.PlaybackFinished, this.stopTimer);
        player.on(player.exports.PlayerEvent.Destroy, this.stopTimer);
        uimanager.getConfig().events.onUpdated.subscribe(this.dispatchChanged);
    };
    PlayerInsightsProvider.prototype.activate = function () {
        this.active = true;
        this.dispatchChanged();
        this.startTimer();
    };
    PlayerInsightsProvider.prototype.deactivate = function () {
        this.active = false;
        this.stopTimer();
    };
    PlayerInsightsProvider.prototype.release = function () {
        var _a;
        this.active = false;
        this.stopTimer();
        if (this.playerApi) {
            this.playerApi.off(this.playerApi.exports.PlayerEvent.Play, this.updateAndStartTimer);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.Playing, this.updateAndStartTimer);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.Paused, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.Seeked, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.SourceLoaded, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.SourceUnloaded, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.VideoQualityChanged, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.AudioQualityChanged, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.PlayerResized, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.StallStarted, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.StallEnded, this.dispatchChanged);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.PlaybackFinished, this.stopTimer);
            this.playerApi.off(this.playerApi.exports.PlayerEvent.Destroy, this.stopTimer);
        }
        (_a = this.uimanager) === null || _a === void 0 ? void 0 : _a.getConfig().events.onUpdated.unsubscribe(this.dispatchChanged);
        this.events.onChanged.unsubscribeAll();
        this.playerApi = null;
        this.uimanager = null;
    };
    Object.defineProperty(PlayerInsightsProvider.prototype, "onChanged", {
        get: function () {
            return this.events.onChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    PlayerInsightsProvider.prototype.getSnapshots = function (player) {
        var snapshots = [];
        for (var propertyName in this.properties) {
            snapshots.push(this.properties[propertyName].getSnapshot(player));
        }
        return snapshots;
    };
    PlayerInsightsProvider.prototype.startTimer = function () {
        this.stopTimer();
        if (!this.playerApi || !this.active || this.refreshIntervalMs === -1) {
            return;
        }
        this.refreshTimer = new Timeout_1.Timeout(this.refreshIntervalMs, this.dispatchChanged, true).start();
    };
    return PlayerInsightsProvider;
}());
exports.PlayerInsightsProvider = PlayerInsightsProvider;
var PlayerInsightProperty = /** @class */ (function () {
    function PlayerInsightProperty(leadingLabel, valueProvider) {
        this.label = leadingLabel;
        this.valueProvider = valueProvider;
    }
    Object.defineProperty(PlayerInsightProperty.prototype, "leadingLabel", {
        get: function () {
            return this.label;
        },
        enumerable: false,
        configurable: true
    });
    PlayerInsightProperty.prototype.getSnapshot = function (player) {
        var value = this.valueProvider(player);
        var hasValue = value != null && value !== '';
        return {
            value: value,
            visible: hasValue,
        };
    };
    return PlayerInsightProperty;
}());
exports.PlayerInsightProperty = PlayerInsightProperty;
