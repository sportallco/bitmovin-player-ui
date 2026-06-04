import { PlayerAPI } from 'bitmovin-player';
import { Event } from '../EventDispatcher';
export interface AdBreakTrackerAdCountChangedArgs {
    currentAdIndex: number;
    totalNumberOfAds: number;
}
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
export declare class AdBreakTracker {
    private readonly player;
    private groupBreaks;
    private groupScheduleTime;
    private readonly events;
    constructor(player: PlayerAPI);
    get onAdCountChanged(): Event<AdBreakTracker, AdBreakTrackerAdCountChangedArgs>;
    /**
     * Index of the currently playing ad across all subsequent ad breaks (1-based), or 0 when no ad
     * is active.
     */
    get currentAdIndex(): number;
    /** Total ad count across all subsequent ad breaks. */
    get totalNumberOfAds(): number;
    /** Unsubscribes all player events and resets state. Call when the tracker is no longer needed. */
    release(): void;
    private readonly handleAdStarted;
    private readonly handleAdBreakFinished;
    private dispatchChanged;
    private reset;
}
