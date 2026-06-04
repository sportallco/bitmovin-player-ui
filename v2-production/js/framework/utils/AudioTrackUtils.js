"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTrackSwitchHandler = void 0;
var i18n_1 = require("../localization/i18n");
/**
 * Helper class to handle all audio tracks related events
 *
 * This class listens to player events as well as the `ListSelector` event if selection changed
 *
 * @category Utils
 */
var AudioTrackSwitchHandler = /** @class */ (function () {
    function AudioTrackSwitchHandler(player, element, uimanager) {
        var _this = this;
        this.addAudioTrack = function (event) {
            var addedAudioTrack = event.track;
            if (!_this.hasComparator()) {
                if (!_this.listElement.hasItem(addedAudioTrack.id)) {
                    _this.listElement.addItem(addedAudioTrack.id, i18n_1.i18n.getLocalizer(addedAudioTrack.label), true);
                }
                return;
            }
            var availableAudioTracks = _this.player.getAvailableAudio();
            var mergedTracks = availableAudioTracks.some(function (track) { return track.id === addedAudioTrack.id; })
                ? availableAudioTracks
                : __spreadArray(__spreadArray([], availableAudioTracks, true), [addedAudioTrack], false);
            _this.listElement.synchronizeItems(mergedTracks.map(function (audioTrack) { return _this.audioTrackToListItem(audioTrack); }));
            _this.selectCurrentAudioTrack();
        };
        this.removeAudioTrack = function (event) {
            var audioTrack = event.track;
            if (_this.listElement.hasItem(audioTrack.id)) {
                _this.listElement.removeItem(audioTrack.id);
            }
        };
        this.selectCurrentAudioTrack = function () {
            var currentAudioTrack = _this.player.getAudio();
            // HLS streams don't always provide this, so we have to check
            if (currentAudioTrack) {
                _this.listElement.selectItem(currentAudioTrack.id);
            }
        };
        this.refreshAudioTracks = function () {
            var previouslySelectedAudioTrack = _this.listElement.getSelectedItem();
            _this.listElement.synchronizeItems(_this.player.getAvailableAudio().map(function (audioTrack) { return _this.audioTrackToListItem(audioTrack); }));
            if (_this.player.getAudio()) {
                _this.selectCurrentAudioTrack();
            }
            else if (previouslySelectedAudioTrack && _this.listElement.hasItem(previouslySelectedAudioTrack)) {
                // HLS streams don't always report the selected audio track via getAudio() after a refresh.
                // If getAudio() is unavailable, restore the previously selected track if it still exists.
                _this.listElement.selectItem(previouslySelectedAudioTrack);
            }
        };
        this.player = player;
        this.listElement = element;
        this.uimanager = uimanager;
        this.bindSelectionEvent();
        this.bindPlayerEvents();
        this.refreshAudioTracks();
    }
    AudioTrackSwitchHandler.prototype.bindSelectionEvent = function () {
        var _this = this;
        this.listElement.onItemSelectionChanged.subscribe(function (_, value) {
            _this.player.setAudio(value);
        });
    };
    AudioTrackSwitchHandler.prototype.bindPlayerEvents = function () {
        // Update selection when selected track has changed
        this.player.on(this.player.exports.PlayerEvent.AudioChanged, this.selectCurrentAudioTrack);
        // Update tracks when source goes away
        this.player.on(this.player.exports.PlayerEvent.SourceUnloaded, this.refreshAudioTracks);
        // Update tracks when the period within a source changes
        this.player.on(this.player.exports.PlayerEvent.PeriodSwitched, this.refreshAudioTracks);
        // Update tracks when a track is added or removed
        this.player.on(this.player.exports.PlayerEvent.AudioAdded, this.addAudioTrack);
        this.player.on(this.player.exports.PlayerEvent.AudioRemoved, this.removeAudioTrack);
        this.uimanager.getConfig().events.onUpdated.subscribe(this.refreshAudioTracks);
    };
    AudioTrackSwitchHandler.prototype.hasComparator = function () {
        return this.listElement.getConfig().comparator != null;
    };
    AudioTrackSwitchHandler.prototype.audioTrackToListItem = function (audioTrack) {
        return { key: audioTrack.id, label: audioTrack.label };
    };
    return AudioTrackSwitchHandler;
}());
exports.AudioTrackSwitchHandler = AudioTrackSwitchHandler;
