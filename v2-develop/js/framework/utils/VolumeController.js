"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeTransition = exports.VolumeController = void 0;
var EventDispatcher_1 = require("../EventDispatcher");
/**
 * Can be used to centrally manage and control the volume and mute state of the player from multiple components.
 */
var VolumeController = /** @class */ (function () {
    function VolumeController(player) {
        var _this = this;
        this.player = player;
        this.events = {
            onChanged: new EventDispatcher_1.EventDispatcher(),
        };
        this.transitionActive = false;
        // If player's volume is `0`, `storeVolume` will not store that, therefore assigning the `defaultVolume` to ensure
        // `storedVolume` is properly initialized.
        this.storedVolume = VolumeController.defaultVolume;
        this.storeVolume();
        var handler = function () {
            _this.onChangedEvent();
        };
        player.on(player.exports.PlayerEvent.SourceLoaded, handler);
        player.on(player.exports.PlayerEvent.VolumeChanged, handler);
        player.on(player.exports.PlayerEvent.Muted, handler);
        player.on(player.exports.PlayerEvent.Unmuted, handler);
    }
    VolumeController.prototype.setVolume = function (volume) {
        this.player.setVolume(volume, VolumeController.issuerName);
    };
    VolumeController.prototype.getVolume = function () {
        return this.player.getVolume();
    };
    VolumeController.prototype.setMuted = function (muted) {
        if (muted) {
            this.player.mute(VolumeController.issuerName);
        }
        else {
            this.player.unmute(VolumeController.issuerName);
        }
    };
    VolumeController.prototype.toggleMuted = function () {
        if (this.isMuted() || this.getVolume() === 0) {
            // Unmuting from the mute or zero-volume state recalls the previously saved volume setting. Setting the
            // volume automatically unmutes the player in v7.
            this.recallVolume();
        }
        else {
            this.setMuted(true);
        }
    };
    VolumeController.prototype.isMuted = function () {
        return this.player.isMuted();
    };
    /**
     * Stores (saves) the current volume so it can later be restored with {@link recallVolume}.
     */
    VolumeController.prototype.storeVolume = function () {
        var volume = this.getVolume();
        if (volume > 0) {
            this.storedVolume = volume;
        }
    };
    /**
     * Recalls (sets) the volume previously stored with {@link storeVolume}.
     */
    VolumeController.prototype.recallVolume = function () {
        var volume = this.storedVolume > 0 ? this.storedVolume : VolumeController.defaultVolume;
        this.setMuted(false);
        this.setVolume(volume);
    };
    VolumeController.prototype.startTransition = function () {
        this.transitionActive = true;
        return new VolumeTransition(this);
    };
    VolumeController.prototype.endTransition = function () {
        this.transitionActive = false;
    };
    VolumeController.prototype.onChangedEvent = function () {
        var playerMuted = this.isMuted();
        var playerVolume = this.getVolume();
        var uiMuted = playerMuted || playerVolume === 0;
        var uiVolume = playerMuted ? 0 : playerVolume;
        // Don't store intermediate volume values while the user is scrubbing the volume slider.
        // The VolumeTransition will store the final value when scrubbing finishes.
        if (!this.transitionActive) {
            this.storeVolume();
        }
        this.events.onChanged.dispatch(this, { volume: uiVolume, muted: uiMuted });
    };
    Object.defineProperty(VolumeController.prototype, "onChanged", {
        /**
         * Gets the event that is fired when the volume settings have changed.
         */
        get: function () {
            return this.events.onChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    VolumeController.issuerName = 'ui-volumecontroller';
    VolumeController.defaultVolume = 100;
    return VolumeController;
}());
exports.VolumeController = VolumeController;
var VolumeTransition = /** @class */ (function () {
    function VolumeTransition(controller) {
        this.controller = controller;
        // Store the volume at the beginning of a volume change so we can recall it later in case we set the volume to
        // zero and actually mute the player.
        controller.storeVolume();
    }
    VolumeTransition.prototype.update = function (volume) {
        // Update the volume while transitioning so the user has a "live preview" of the desired target volume
        this.controller.setMuted(false);
        this.controller.setVolume(volume);
    };
    VolumeTransition.prototype.finish = function (volume) {
        if (volume === 0) {
            // When the volume is zero we essentially mute the volume so we recall the volume from the beginning of the
            // transition and mute the player instead. Recalling is necessary to return to the actual audio volume
            // when unmuting.
            // We must first recall the volume and then mute, because recalling sets the volume on the player
            // and setting a player volume > 0 unmutes the player in v7.
            this.controller.recallVolume();
            this.controller.setMuted(true);
        }
        else {
            this.controller.setMuted(false);
            this.controller.setVolume(volume);
            this.controller.storeVolume();
        }
        // End the transition after all volume/mute operations are complete, so that events emitted
        // during finish() don't trigger storeVolume() with intermediate values.
        this.controller.endTransition();
    };
    return VolumeTransition;
}());
exports.VolumeTransition = VolumeTransition;
