"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineMarkersHandler = void 0;
var DOM_1 = require("../DOM");
var PlayerUtils_1 = require("./PlayerUtils");
var Timeout_1 = require("./Timeout");
var DummyComponent_1 = require("../components/DummyComponent");
var defaultMarkerUpdateIntervalMs = 1000;
var TimelineMarkersHandler = /** @class */ (function () {
    function TimelineMarkersHandler(config, getSeekBarWidth, markersContainer) {
        this.markerPositionUpdater = null;
        this.isTimeShifting = false;
        // On some platforms, there are inconsistencies between the timeShift and currentTime values during time-shifting
        // in a live stream. Those values are used to calculate a seekable-range during a live stream.
        // To properly calculate the marker position, we rely on the seekable range of the DVR window.
        // To work around the mentioned inconsistencies, we store the last known seekableRange and use
        // it for marker position calculation during time-shifting/scrubbing.
        this.seekableRangeSnapshot = null;
        this.config = config;
        this.getSeekBarWidth = getSeekBarWidth;
        this.markersContainer = markersContainer;
        this.timelineMarkers = [];
    }
    TimelineMarkersHandler.prototype.initialize = function (player, uimanager) {
        this.player = player;
        this.uimanager = uimanager;
        this.configureMarkers();
    };
    TimelineMarkersHandler.prototype.configureMarkers = function () {
        var _this = this;
        var onTimeShift = function () {
            _this.isTimeShifting = true;
        };
        var onTimeShifted = function () {
            _this.isTimeShifting = false;
        };
        var onSeekPreview = function (_, args) {
            if (args.scrubbing) {
                onTimeShift();
            }
        };
        var reset = function () {
            _this.stopLiveMarkerUpdater();
            _this.clearMarkers();
            _this.isTimeShifting = false;
            _this.seekableRangeSnapshot = null;
            _this.player.off(_this.player.exports.PlayerEvent.TimeShift, onTimeShift);
            _this.player.off(_this.player.exports.PlayerEvent.TimeShifted, onTimeShifted);
            _this.uimanager.onSeekPreview.unsubscribe(onSeekPreview);
        };
        this.player.on(this.player.exports.PlayerEvent.SourceUnloaded, reset);
        this.player.on(this.player.exports.PlayerEvent.Destroy, reset);
        this.player.on(this.player.exports.PlayerEvent.AdBreakStarted, function () { return _this.clearMarkers(); });
        this.player.on(this.player.exports.PlayerEvent.AdBreakFinished, function () { return _this.updateMarkers(); });
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(this.player, this.uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            if (args.live) {
                _this.player.on(_this.player.exports.PlayerEvent.TimeShift, onTimeShift);
                _this.player.on(_this.player.exports.PlayerEvent.TimeShifted, onTimeShifted);
                _this.uimanager.onSeekPreview.subscribe(onSeekPreview);
                _this.startLiveMarkerUpdater();
            }
            else {
                _this.stopLiveMarkerUpdater();
                _this.uimanager.onSeekPreview.unsubscribe(onSeekPreview);
                _this.player.off(_this.player.exports.PlayerEvent.TimeShift, onTimeShift);
                _this.player.off(_this.player.exports.PlayerEvent.TimeShifted, onTimeShifted);
            }
        });
        liveStreamDetector.detect(); // Initial detection
        this.uimanager.getConfig().events.onUpdated.subscribe(function () { return _this.updateMarkers(); });
        this.uimanager.onRelease.subscribe(function () {
            _this.uimanager.getConfig().events.onUpdated.unsubscribe(function () { return _this.updateMarkers(); });
            reset();
        });
        // Refresh timeline markers when the player is resized or the UI is configured. Timeline markers
        // are positioned absolutely and must therefore be updated when the size of the seekbar changes.
        this.player.on(this.player.exports.PlayerEvent.PlayerResized, function () { return _this.updateMarkersDOM(); });
        // Additionally, when this code is called, the seekbar is not part of the UI yet and therefore does not have a size,
        // resulting in a wrong initial position of the marker. Refreshing it once the UI is configured solved this issue.
        this.uimanager.onConfigured.subscribe(function () {
            _this.updateMarkers();
        });
        this.player.on(this.player.exports.PlayerEvent.SourceLoaded, function () {
            _this.updateMarkers();
        });
        // Init markers at startup
        this.updateMarkers();
    };
    TimelineMarkersHandler.prototype.getMarkerAtPosition = function (percentage) {
        var snappingRange = this.config.snappingRange;
        var matchingMarker = this.timelineMarkers.find(function (marker) {
            var hasDuration = marker.duration > 0;
            // Handle interval markers
            var intervalMarkerMatch = hasDuration &&
                percentage >= marker.position - snappingRange &&
                percentage <= marker.position + marker.duration + snappingRange;
            // Handle position markers
            var positionMarkerMatch = percentage >= marker.position - snappingRange && percentage <= marker.position + snappingRange;
            return intervalMarkerMatch || positionMarkerMatch;
        });
        return matchingMarker || null;
    };
    TimelineMarkersHandler.prototype.clearMarkers = function () {
        this.timelineMarkers = [];
        this.markersContainer.empty();
    };
    TimelineMarkersHandler.prototype.removeMarkerFromConfig = function (marker) {
        this.uimanager.getConfig().metadata.markers = this.uimanager
            .getConfig()
            .metadata.markers.filter(function (_marker) { return marker !== _marker; });
    };
    TimelineMarkersHandler.prototype.filterRemovedMarkers = function () {
        var _this = this;
        this.timelineMarkers = this.timelineMarkers.filter(function (seekbarMarker) {
            var matchingMarker = _this.uimanager
                .getConfig()
                .metadata.markers.find(function (_marker) { return seekbarMarker.marker === _marker; });
            if (!matchingMarker) {
                _this.removeMarkerFromDOM(seekbarMarker);
            }
            return matchingMarker;
        });
    };
    TimelineMarkersHandler.prototype.removeMarkerFromDOM = function (marker) {
        if (marker.element) {
            marker.element.remove();
        }
    };
    TimelineMarkersHandler.prototype.updateMarkers = function () {
        var _this = this;
        var seekBarWidth = this.getSeekBarWidth();
        if (seekBarWidth === 0) {
            // Skip marker update when the seekBarWidth is not yet available.
            // Will be updated by PlayerResized/onConfigured events once dimensions are available.
            return;
        }
        if (!shouldProcessMarkers(this.player, this.uimanager)) {
            this.clearMarkers();
            return;
        }
        this.filterRemovedMarkers();
        this.uimanager.getConfig().metadata.markers.forEach(function (marker) {
            var _a = getMarkerPositions(_this.player, _this.getSeekableRangeRespectingSnapshot(), marker), markerPosition = _a.markerPosition, markerDuration = _a.markerDuration;
            if (shouldRemoveMarker(markerPosition, markerDuration)) {
                _this.removeMarkerFromConfig(marker);
            }
            else if (markerPosition <= 100) {
                var matchingMarker = _this.timelineMarkers.find(function (seekbarMarker) { return seekbarMarker.marker === marker; });
                if (matchingMarker) {
                    matchingMarker.position = markerPosition;
                    matchingMarker.duration = markerDuration;
                    _this.updateMarkerDOM(matchingMarker);
                }
                else {
                    var newMarker = { marker: marker, position: markerPosition, duration: markerDuration };
                    _this.timelineMarkers.push(newMarker);
                    _this.createMarkerDOM(newMarker);
                }
            }
        });
    };
    TimelineMarkersHandler.prototype.getMarkerCssProperties = function (marker, includeTransition) {
        if (includeTransition === void 0) { includeTransition = true; }
        var seekBarWidthPx = this.getSeekBarWidth();
        var positionInPx = (seekBarWidthPx / 100) * (marker.position < 0 ? 0 : marker.position);
        var cssProperties = {
            transform: "translateX(".concat(positionInPx, "px)"),
        };
        if (includeTransition) {
            var updateIntervalMs = this.config.markerUpdateIntervalMs || defaultMarkerUpdateIntervalMs;
            cssProperties['transition-duration'] = "".concat(updateIntervalMs, "ms");
        }
        else {
            cssProperties['transition'] = 'none';
        }
        if (marker.duration > 0) {
            var markerWidthPx = Math.round((seekBarWidthPx / 100) * marker.duration);
            cssProperties['width'] = "".concat(markerWidthPx, "px");
        }
        return cssProperties;
    };
    TimelineMarkersHandler.prototype.updateMarkerDOM = function (marker) {
        // Removing the 'transition: none' value from the initial creation when updating the marker position.
        marker.element.removeCss('transition');
        marker.element.css(this.getMarkerCssProperties(marker, true));
    };
    TimelineMarkersHandler.prototype.createMarkerDOM = function (marker) {
        var markerClasses = ['seekbar-marker']
            .concat(marker.marker.cssClasses || [])
            .map(function (cssClass) { return (0, DummyComponent_1.prefixCss)(cssClass); });
        var markerStartIndicator = new DOM_1.DOM('div', {
            class: (0, DummyComponent_1.prefixCss)('seekbar-marker-indicator'),
        });
        var markerEndIndicator = new DOM_1.DOM('div', {
            class: (0, DummyComponent_1.prefixCss)('seekbar-marker-indicator'),
        });
        var markerElement = new DOM_1.DOM('div', {
            class: markerClasses.join(' '),
            'data-marker-time': String(marker.marker.time),
            'data-marker-title': String(marker.marker.title),
        })
            // We do not want to animate the initial creation of a marker to prevent a 'fly in' animation.
            // Only updating the marker position will be animated.
            .css(this.getMarkerCssProperties(marker, false));
        if (marker.marker.imageUrl) {
            var removeImage = function () {
                imageElement_1.remove();
            };
            var imageElement_1 = new DOM_1.DOM('img', {
                class: (0, DummyComponent_1.prefixCss)('seekbar-marker-image'),
                src: marker.marker.imageUrl,
            }).on('error', removeImage);
            markerElement.append(imageElement_1);
        }
        markerElement.append(markerStartIndicator);
        if (marker.duration > 0) {
            markerElement.append(markerEndIndicator);
        }
        marker.element = markerElement;
        this.markersContainer.append(markerElement);
    };
    TimelineMarkersHandler.prototype.updateMarkersDOM = function () {
        var _this = this;
        this.timelineMarkers.forEach(function (marker) {
            if (marker.element) {
                _this.updateMarkerDOM(marker);
            }
            else {
                _this.createMarkerDOM(marker);
            }
        });
    };
    TimelineMarkersHandler.prototype.startLiveMarkerUpdater = function () {
        var _this = this;
        var updateIntervalMs = this.config.markerUpdateIntervalMs || defaultMarkerUpdateIntervalMs;
        this.stopLiveMarkerUpdater();
        this.captureSeekableRangeSnapshot();
        this.markerPositionUpdater = new Timeout_1.Timeout(updateIntervalMs, function () {
            if (!_this.isTimeShifting) {
                _this.captureSeekableRangeSnapshot();
            }
            _this.updateMarkers();
        }, true);
        this.markerPositionUpdater.start();
    };
    TimelineMarkersHandler.prototype.stopLiveMarkerUpdater = function () {
        if (this.markerPositionUpdater) {
            this.markerPositionUpdater.clear();
            this.markerPositionUpdater = null;
        }
    };
    TimelineMarkersHandler.prototype.captureSeekableRangeSnapshot = function () {
        var seekableRange = PlayerUtils_1.PlayerUtils.getSeekableRangeRespectingLive(this.player);
        this.seekableRangeSnapshot = {
            start: seekableRange.start,
            end: seekableRange.end,
            timestampMs: Date.now(),
        };
    };
    TimelineMarkersHandler.prototype.getSeekableRangeRespectingSnapshot = function () {
        var seekableRange = PlayerUtils_1.PlayerUtils.getSeekableRangeRespectingLive(this.player);
        if (!this.player.isLive()) {
            return seekableRange;
        }
        if (this.isTimeShifting && this.seekableRangeSnapshot) {
            // Interpolate the last snapshot so the sliding DVR window keeps moving while time-shifting.
            var elapsedSeconds = (Date.now() - this.seekableRangeSnapshot.timestampMs) / 1000;
            return {
                start: this.seekableRangeSnapshot.start + elapsedSeconds,
                end: this.seekableRangeSnapshot.end + elapsedSeconds,
            };
        }
        return seekableRange;
    };
    return TimelineMarkersHandler;
}());
exports.TimelineMarkersHandler = TimelineMarkersHandler;
function getMarkerPositions(player, seekableRange, marker) {
    var duration = getDuration(player, seekableRange);
    var markerPosition = (100 / duration) * getMarkerTime(marker, player, duration, seekableRange); // convert absolute time to percentage
    var markerDuration = (100 / duration) * marker.duration;
    if (markerPosition < 0 && !isNaN(markerDuration)) {
        // Shrink marker duration for on live streams as they reach end
        markerDuration = markerDuration + markerPosition;
    }
    if (100 - markerPosition < markerDuration) {
        // Shrink marker if it overflows timeline
        markerDuration = 100 - markerPosition;
    }
    return { markerDuration: markerDuration, markerPosition: markerPosition };
}
function getMarkerTime(marker, player, duration, seekableRange) {
    if (!player.isLive()) {
        return marker.time;
    }
    return duration - (seekableRange.end - marker.time);
}
function getDuration(player, seekableRange) {
    if (!player.isLive()) {
        return player.getDuration();
    }
    var start = seekableRange.start, end = seekableRange.end;
    return end - start;
}
function shouldRemoveMarker(markerPosition, markerDuration) {
    return (markerDuration < 0 || isNaN(markerDuration)) && markerPosition < 0;
}
function shouldProcessMarkers(player, uimanager) {
    // Don't generate timeline markers if we don't yet have a duration
    // The duration check is for buggy platforms where the duration is not available instantly (Chrome on Android 4.3)
    var validToProcess = player.getDuration() !== Infinity || player.isLive();
    var hasMarkers = uimanager.getConfig().metadata.markers.length > 0;
    return validToProcess && hasMarkers;
}
