"use strict";
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
exports.PlayerInsightsUtils = void 0;
var DOWN_ARROW_CHARACTER = '\u2193';
var BITS_PER_KILOBIT = 1000;
var BITS_PER_MEGABIT = BITS_PER_KILOBIT * 1000;
var PlayerInsightsUtils;
(function (PlayerInsightsUtils) {
    /** Formats the currently playing and downloaded video quality details for the panel row. */
    function formatVideoQualityInsight(player) {
        var availableVideoQualities = player.getAvailableVideoQualities();
        var playbackVideoQualityInsight = player.getPlaybackVideoData();
        // The downloadVideoQuality does not contain the frame-rate or other quality-related properties.
        // Therefore, we extract them from the available video qualities by mapping them via their IDs.
        var downloadedVideo = player.getDownloadedVideoData();
        var downloadVideoQualityInsight = enrichDownloadedQualityData(downloadedVideo, availableVideoQualities);
        return formatPlaybackAndDownloadedQuality(playbackVideoQualityInsight, downloadVideoQualityInsight);
    }
    PlayerInsightsUtils.formatVideoQualityInsight = formatVideoQualityInsight;
    /** Formats the currently playing and downloaded audio quality details for the panel row. */
    function formatAudioQualityInsight(player) {
        var availableAudioQualities = player.getAvailableAudioQualities();
        var playbackAudioQualityInsight = player.getPlaybackAudioData();
        // The downloadAudioQuality does not contain the frame-rate or other quality-related properties.
        // Therefore, we extract them from the available video qualities by mapping them via their IDs.
        var downloadedAudio = player.getDownloadedAudioData();
        var downloadAudioQualityInsight = enrichDownloadedQualityData(downloadedAudio, availableAudioQualities);
        return formatPlaybackAndDownloadedQuality(playbackAudioQualityInsight, downloadAudioQualityInsight);
    }
    PlayerInsightsUtils.formatAudioQualityInsight = formatAudioQualityInsight;
    /** Formats the current video element size together with dropped frame count. */
    function formatViewportFramesInsight(player) {
        var videoElement = player.getVideoElement();
        var viewport = videoElement.clientWidth > 0 && videoElement.clientHeight > 0
            ? "".concat(videoElement.clientWidth, "x").concat(videoElement.clientHeight)
            : null;
        var frames = "".concat(player.getDroppedVideoFrames(), " dropped");
        return viewport ? "".concat(viewport, " / ").concat(frames) : frames;
    }
    PlayerInsightsUtils.formatViewportFramesInsight = formatViewportFramesInsight;
    /** Formats forward video and audio buffer levels from the player buffer API. */
    function formatBufferInsight(player) {
        var videoBufferLevel = player.buffer.getLevel(player.exports.BufferType.ForwardDuration, player.exports.MediaType.Video).level;
        var audioBufferLevel = player.buffer.getLevel(player.exports.BufferType.ForwardDuration, player.exports.MediaType.Audio).level;
        if (videoBufferLevel == null && audioBufferLevel == null) {
            return null;
        }
        var bufferLevels = [
            videoBufferLevel != null ? "".concat(videoBufferLevel.toFixed(2), "s") : "-",
            audioBufferLevel != null ? "".concat(audioBufferLevel.toFixed(2), "s") : "-",
        ];
        return bufferLevels.join(' / ');
    }
    PlayerInsightsUtils.formatBufferInsight = formatBufferInsight;
    /** Formats the current playback time, duration, live latency, and playback speed. */
    function formatTimeInsight(player) {
        var isLive = player.isLive();
        if (isLive) {
            var timeShift = player.getTimeShift();
            var currentTime_1 = player.getCurrentTime();
            return "".concat(formatLiveTime(currentTime_1), " / TimeShift: ").concat(timeShift.toFixed(2), "s");
        }
        var currentTime = player.getCurrentTime();
        var duration = player.getDuration();
        return "".concat(formatSeconds(currentTime), " / ").concat(formatSeconds(duration));
    }
    PlayerInsightsUtils.formatTimeInsight = formatTimeInsight;
    /** Formats the stream technology and active player type for the panel row. */
    function formatStreamInsight(player) {
        var streamType = player.getStreamType();
        var playerType = player.getPlayerType();
        if (!streamType && !playerType) {
            return null;
        }
        return [streamType, playerType ? "(".concat(playerType, ")") : null].filter(Boolean).join(' ');
    }
    PlayerInsightsUtils.formatStreamInsight = formatStreamInsight;
})(PlayerInsightsUtils || (exports.PlayerInsightsUtils = PlayerInsightsUtils = {}));
function enrichDownloadedQualityData(downloadedQuality, availableQualities) {
    if (!downloadedQuality) {
        return undefined;
    }
    var matchingQuality = availableQualities.find(function (quality) { return quality.id === downloadedQuality.id; });
    return __assign(__assign({}, downloadedQuality), { codec: matchingQuality === null || matchingQuality === void 0 ? void 0 : matchingQuality.codec, frameRate: matchingQuality === null || matchingQuality === void 0 ? void 0 : matchingQuality.frameRate });
}
function formatPlaybackAndDownloadedQuality(playbackQuality, downloadedQuality) {
    var playbackValue = formatQualityInsight(playbackQuality);
    var downloadedValue = formatQualityInsight(downloadedQuality);
    if (!playbackValue) {
        return downloadedValue || null;
    }
    if (!downloadedValue || (playbackQuality === null || playbackQuality === void 0 ? void 0 : playbackQuality.id) === (downloadedQuality === null || downloadedQuality === void 0 ? void 0 : downloadedQuality.id) || playbackValue === downloadedValue) {
        return playbackValue;
    }
    // Show both values when playback and downloaded renditions differ.
    return "".concat(playbackValue, " / ").concat(DOWN_ARROW_CHARACTER).concat(downloadedValue);
}
/** Builds the display value for a quality value. */
function formatQualityInsight(quality) {
    if (!quality) {
        return '';
    }
    var parts = [];
    var resolution = formatResolution(quality);
    var bitrate = formatBitrate(quality.bitrate);
    if (resolution) {
        parts.push(resolution);
    }
    if (bitrate) {
        parts.push(bitrate);
    }
    if (quality.codec) {
        parts.push(quality.codec);
    }
    return parts.length > 0 ? parts.join(',') : '';
}
/** Formats resolution and optional frame rate for video quality display. */
function formatResolution(quality) {
    return quality.width && quality.height
        ? "".concat(quality.width, "x").concat(quality.height).concat(quality.frameRate ? "@".concat(quality.frameRate) : '')
        : null;
}
/** Formats bitrate in Mbps or kbps depending on its size. */
function formatBitrate(bitrate) {
    if (!bitrate || !isFinite(bitrate)) {
        return '';
    }
    if (bitrate >= BITS_PER_MEGABIT) {
        return "".concat((bitrate / BITS_PER_MEGABIT).toFixed(2), "Mbps");
    }
    return "".concat(Math.round(bitrate / BITS_PER_KILOBIT), "kbps");
}
/** Formats a duration-like value as h:mm:ss or m:ss. */
function formatSeconds(seconds) {
    if (!isFinite(seconds)) {
        return 'Infinity';
    }
    var total = Math.floor(Math.abs(seconds));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var remainingSeconds = total % 60;
    var pad = function (value) { return (value < 10 ? "0".concat(value) : value.toString()); };
    return hours > 0 ? "".concat(hours, ":").concat(pad(minutes), ":").concat(pad(remainingSeconds)) : "".concat(minutes, ":").concat(pad(remainingSeconds));
}
/** Formats absolute live time as a clock and relative live time as a duration. */
function formatLiveTime(seconds) {
    return isUnixTimestamp(seconds) ? formatClockTime(seconds) : formatSeconds(seconds);
}
/** Detects absolute wall-clock timestamps returned for live playback. */
function isUnixTimestamp(seconds) {
    return seconds >= Date.UTC(2000, 0, 1) / 1000;
}
/** Formats a Unix timestamp in seconds as a local wall-clock time. */
function formatClockTime(seconds) {
    var date = new Date(seconds * 1000);
    var pad = function (value) { return (value < 10 ? "0".concat(value) : value.toString()); };
    return "".concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()), ":").concat(pad(date.getSeconds()));
}
