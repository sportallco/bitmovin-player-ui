import { PlayerAPI } from 'bitmovin-player';
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
export declare class UIPreferencesManager {
    private player;
    private enabled;
    private unsubscribeHandlers;
    /**
     * Wires the manager to a player. When the end-user toggle is configured, the persisted
     * `enabled` flag takes precedence; otherwise `enabledByDefault` (the integrator's
     * `UIConfig.enablePersistentPreferences`) decides. When enabled, the stored preferences
     * are reapplied and subsequent changes are tracked.
     */
    configure(player: PlayerAPI, enabledByDefault: boolean, respectStoredEnabled: boolean): void;
    /**
     * Whether preferences are currently being persisted.
     */
    isEnabled(): boolean;
    /**
     * Enables or disables persistence as an explicit end-user choice (via the toggle) and
     * stores that choice.
     *
     * Enabling captures the player's current volume / mute / speed right away so it takes
     * effect immediately, then tracks subsequent changes. Disabling stops tracking and clears
     * the stored preferences so the next session starts fresh.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Detaches all player event listeners. Call when the UI instance is released.
     */
    release(): void;
    private startTracking;
    private track;
    private stopTracking;
    private capture;
    private clear;
    private apply;
}
