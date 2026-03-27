"use strict";
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
            var audioTrack = event.track;
            if (!_this.listElement.hasItem(audioTrack.id)) {
                _this.listElement.addItem(audioTrack.id, i18n_1.i18n.getLocalizer(audioTrack.label), true);
            }
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
            var audioTracks = _this.player.getAvailableAudio();
            var audioTrackToListItem = function (audioTrack) {
                return { key: audioTrack.id, label: audioTrack.label };
            };
            _this.listElement.synchronizeItems(audioTracks.map(audioTrackToListItem));
            _this.selectCurrentAudioTrack();
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
    return AudioTrackSwitchHandler;
}());
exports.AudioTrackSwitchHandler = AudioTrackSwitchHandler;
