"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIPreferencesManager = void 0;
var StorageUtils_1 = require("./StorageUtils");
var STORAGE_KEY_PREFIX = 'bitmovin.player.ui.preferences.';
var KEY_ENABLED = STORAGE_KEY_PREFIX + 'enabled';
var KEY_VOLUME = STORAGE_KEY_PREFIX + 'volume';
var KEY_MUTED = STORAGE_KEY_PREFIX + 'muted';
var KEY_PLAYBACK_SPEED = STORAGE_KEY_PREFIX + 'playbackSpeed';
var ISSUER = 'ui-preferences';
/**
 * Persists a small set of cross-session UI preferences (volume, mute state, playback
 * speed) into localStorage and reapplies them whenever a player using this UI is
 * initialized.
 *
 * Follows the same ownership model as {@link SubtitleSettingsManager}: the manager
 * subscribes to the relevant player events itself and tears them down on {@link release},
 * so the `UIManager` only has to create, {@link configure} and {@link release} it rather
 * than wiring up the player lifecycle by hand.
 *
 * Persistence is gated by an `enabled` flag that is itself persisted. Integrators can
 * switch it on by default via `UIConfig.enablePersistentPreferences`, and/or expose an
 * end-user opt-in toggle via `UIConfig.showPersistentPreferencesToggle`. While disabled
 * the manager holds no player subscriptions and stores nothing.
 *
 * All storage access routes through {@link StorageUtils}, which no-ops when storage is
 * unavailable (private browsing, restricted WebViews, `disableStorageApi`).
 *
 * @category Utils
 */
var UIPreferencesManager = /** @class */ (function () {
    function UIPreferencesManager() {
        this.player = null;
        this.enabled = false;
        this.unsubscribeHandlers = [];
    }
    /**
     * Wires the manager to a player. When the end-user toggle is configured, the persisted
     * `enabled` flag takes precedence; otherwise `enabledByDefault` (the integrator's
     * `UIConfig.enablePersistentPreferences`) decides. When enabled, the stored preferences
     * are reapplied and subsequent changes are tracked.
     */
    UIPreferencesManager.prototype.configure = function (player, enabledByDefault, respectStoredEnabled) {
        this.player = player;
        var localStorageEnabled = respectStoredEnabled ? readBoolean(KEY_ENABLED) : null;
        // Stored end-user toggle choice wins only when the toggle is configured.
        // otherwise the integrator default is the source of truth.
        this.enabled = localStorageEnabled !== null ? localStorageEnabled : enabledByDefault;
        if (this.enabled) {
            this.startTracking();
            this.apply();
        }
    };
    /**
     * Whether preferences are currently being persisted.
     */
    UIPreferencesManager.prototype.isEnabled = function () {
        return this.enabled;
    };
    /**
     * Enables or disables persistence as an explicit end-user choice (via the toggle) and
     * stores that choice.
     *
     * Enabling captures the player's current volume / mute / speed right away so it takes
     * effect immediately, then tracks subsequent changes. Disabling stops tracking and clears
     * the stored preferences so the next session starts fresh.
     */
    UIPreferencesManager.prototype.setEnabled = function (enabled) {
        this.enabled = enabled;
        saveBoolean(KEY_ENABLED, enabled);
        this.stopTracking();
        if (enabled) {
            this.capture();
            this.startTracking();
            this.apply();
        }
        else {
            this.clear();
        }
    };
    /**
     * Detaches all player event listeners. Call when the UI instance is released.
     */
    UIPreferencesManager.prototype.release = function () {
        this.stopTracking();
        this.player = null;
    };
    UIPreferencesManager.prototype.startTracking = function () {
        var _this = this;
        if (this.player == null) {
            return;
        }
        var Event = this.player.exports.PlayerEvent;
        this.track(Event.VolumeChanged, function () { return saveNumber(KEY_VOLUME, _this.player.getVolume()); });
        this.track(Event.Muted, function () { return saveBoolean(KEY_MUTED, true); });
        this.track(Event.Unmuted, function () { return saveBoolean(KEY_MUTED, false); });
        this.track(Event.PlaybackSpeedChanged, function () { return saveNumber(KEY_PLAYBACK_SPEED, _this.player.getPlaybackSpeed()); });
        // Reapply the stored preferences whenever a new source becomes ready while enabled.
        this.track(Event.Ready, function () { return _this.apply(); });
    };
    UIPreferencesManager.prototype.track = function (event, callback) {
        var _this = this;
        this.player.on(event, callback);
        this.unsubscribeHandlers.push(function () { return _this.player.off(event, callback); });
    };
    UIPreferencesManager.prototype.stopTracking = function () {
        for (var _i = 0, _a = this.unsubscribeHandlers; _i < _a.length; _i++) {
            var unsubscribe = _a[_i];
            unsubscribe();
        }
        this.unsubscribeHandlers = [];
    };
    UIPreferencesManager.prototype.capture = function () {
        saveNumber(KEY_VOLUME, this.player.getVolume());
        saveBoolean(KEY_MUTED, this.player.isMuted());
        saveNumber(KEY_PLAYBACK_SPEED, this.player.getPlaybackSpeed());
    };
    UIPreferencesManager.prototype.clear = function () {
        StorageUtils_1.StorageUtils.removeItem(KEY_VOLUME);
        StorageUtils_1.StorageUtils.removeItem(KEY_MUTED);
        StorageUtils_1.StorageUtils.removeItem(KEY_PLAYBACK_SPEED);
    };
    UIPreferencesManager.prototype.apply = function () {
        if (this.player == null) {
            return;
        }
        var volume = readNumber(KEY_VOLUME);
        if (volume !== null && volume >= 0 && volume <= 100) {
            this.player.setVolume(volume, ISSUER);
        }
        var muted = readBoolean(KEY_MUTED);
        if (muted !== null) {
            if (muted) {
                this.player.mute(ISSUER);
            }
            else {
                this.player.unmute(ISSUER);
            }
        }
        var speed = readNumber(KEY_PLAYBACK_SPEED);
        if (speed !== null && speed > 0) {
            this.player.setPlaybackSpeed(speed);
        }
    };
    return UIPreferencesManager;
}());
exports.UIPreferencesManager = UIPreferencesManager;
function saveNumber(key, value) {
    if (typeof value !== 'number' || !isFinite(value)) {
        return;
    }
    StorageUtils_1.StorageUtils.setItem(key, String(value));
}
function readNumber(key) {
    var raw = StorageUtils_1.StorageUtils.getItem(key);
    if (raw === null) {
        return null;
    }
    var n = parseFloat(raw);
    return isFinite(n) ? n : null;
}
function saveBoolean(key, value) {
    StorageUtils_1.StorageUtils.setItem(key, value ? '1' : '0');
}
function readBoolean(key) {
    var raw = StorageUtils_1.StorageUtils.getItem(key);
    if (raw === null) {
        return null;
    }
    return raw === '1';
}
