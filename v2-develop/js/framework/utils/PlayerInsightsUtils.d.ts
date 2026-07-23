import { PlayerAPI } from 'bitmovin-player';
export declare namespace PlayerInsightsUtils {
    /** Formats the currently playing and downloaded video quality details for the panel row. */
    function formatVideoQualityInsight(player: PlayerAPI): string | null;
    /** Formats the currently playing and downloaded audio quality details for the panel row. */
    function formatAudioQualityInsight(player: PlayerAPI): string | null;
    /** Formats the current video element size together with dropped frame count. */
    function formatViewportFramesInsight(player: PlayerAPI): string;
    /** Formats forward video and audio buffer levels from the player buffer API. */
    function formatBufferInsight(player: PlayerAPI): string | null;
    /** Formats the current playback time, duration, live latency, and playback speed. */
    function formatTimeInsight(player: PlayerAPI): string | null;
    /** Formats the stream technology and active player type for the panel row. */
    function formatStreamInsight(player: PlayerAPI): string | null;
}
