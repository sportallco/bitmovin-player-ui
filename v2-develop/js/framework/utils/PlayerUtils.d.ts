import { Event, NoArgs } from '../EventDispatcher';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI, TimeRange } from 'bitmovin-player';
/**
 * @category Utils
 */
export declare namespace PlayerUtils {
    enum PlayerState {
        Idle = 0,
        Prepared = 1,
        Playing = 2,
        Paused = 3,
        Finished = 4
    }
    function isTimeShiftAvailable(player: PlayerAPI): boolean;
    function getState(player: PlayerAPI): PlayerState;
    /**
     * Returns the currentTime - seekableRange.start. This ensures a user-friendly currentTime after a live stream
     * transitioned to VoD.
     * @param player
     */
    function getCurrentTimeRelativeToSeekableRange(player: PlayerAPI): number;
    /**
     * Returns the start value of the seekable range or the defaultValue if no seekableRange is present.
     * For now this happens only in combination with Mobile SDKs.
     *
     * TODO: remove this function in next major release
     *
     * @param player
     * @param defaultValue
     */
    function getSeekableRangeStart(player: PlayerAPI, defaultValue?: number): number;
    /**
     * Calculates player seekable time range for live.
     * As the player returns `{ start: -1, end: -1 }` for live streams we need to calculate the `seekableRange` based on `maxTimeshift`.
     *
     * @param player
     */
    function getSeekableRangeRespectingLive(player: PlayerAPI): TimeRange;
    interface TimeShiftAvailabilityChangedArgs extends NoArgs {
        timeShiftAvailable: boolean;
    }
    class TimeShiftAvailabilityDetector {
        private player;
        private timeShiftAvailable;
        private timeShiftAvailabilityChangedEvent;
        constructor(player: PlayerAPI);
        detect(): void;
        get onTimeShiftAvailabilityChanged(): Event<PlayerAPI, TimeShiftAvailabilityChangedArgs>;
    }
    interface LiveStreamDetectorEventArgs extends NoArgs {
        live: boolean;
    }
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
    class LiveStreamDetector {
        private player;
        private live;
        private liveChangedEvent;
        private uimanager;
        constructor(player: PlayerAPI, uimanager: UIInstanceManager);
        detect(): void;
        get onLiveChanged(): Event<PlayerAPI, LiveStreamDetectorEventArgs>;
    }
    function clampValueToRange(value: number, boundary1: number, boundary2: number): number;
}
