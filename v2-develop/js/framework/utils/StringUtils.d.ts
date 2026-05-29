import { PlayerAPI } from 'bitmovin-player';
/**
 * @category Utils
 */
export declare namespace StringUtils {
    const FORMAT_HHMMSS: string;
    const FORMAT_MMSS: string;
    /**
     * Formats a number of seconds into a time string with the pattern hh:mm:ss.
     *
     * @param totalSeconds the total number of seconds to format to string
     * @param format the time format to output (default: hh:mm:ss)
     * @returns {string} the formatted time string
     */
    function secondsToTime(totalSeconds: number, format?: string): string;
    function secondsToText(totalSeconds: number): string;
    /**
     * Fills out placeholders in an ad message.
     *
     * Has the following placeholders, which are replaced with:
     *   - '{remainingTime[formatString]}': the remaining time until the ad can be skipped
     *   - '{playedTime[formatString]}': the current time
     *   - '{adDuration[formatString]}': the ad duration
     *   - '{adBreakRemainingTime[formatString]}': the total remaining time of all ads in the ad break
     *   - '{activeAdIndex[formatString]}': the number of the currently played ad within the current ad break by default, or `activeAdIndex` if provided. `activeAdIndex` can be used to show the index of the current ad across multiple ad breaks with the same schedule time.
     *   - '{totalAdsCount[formatString]}': the total number of ads in the current ad break by default, or `totalNumberOfAds` if provided. `totalNumberOfAds` can be used to show the number of ads across multiple ad breaks with the same schedule time.
     *
     * The format string is optional. If not specified, the placeholder is replaced by the time
     * in seconds. If specified, it must be of the following format:
     * - %d - Inserts the time as an integer.
     * - %0Nd - Inserts the time as an integer with leading zeroes, if the length of the time string is smaller than N.
     * - %f - Inserts the time as a float.
     * - %0Nf - Inserts the time as a float with leading zeroes.
     * - %.Mf - Inserts the time as a float with M decimal places. Can be combined with %0Nf, e.g. %04.2f (the time
     * 10.123 would be printed as 0010.12).
     * - %hh:mm:ss
     * - %mm:ss
     *
     * Examples:
     * - { text: 'Ad: {remainingTime%mm:ss} secs' }
     * An input value of 100 would be displayed as: 'Ad: 01:40 secs'
     * - { text: 'Ad: {remainingTime%f} secs' }
     * An input value of 100 would be displayed as: 'Ad: 100.0 secs'
     * - { text: 'Adbreak: {adBreakRemainingTime%f} secs' }
     * Adbreak with 2 ads each 50 seconds would be displayed as: 'Ad: 100.0 secs'
     *
     * @param adMessage an ad message with optional placeholders to fill
     * @param player the player to get the time data from
     * @param skipOffset if specified, {remainingTime} will be filled with the remaining time until the ad can be skipped
     * @param activeAdIndex if specified, {activeAdIndex} will be set to this value. Can be used to calculate the ad index
     *   across multiple ad breaks which are scheduled for the same time. If not provided, the value will be calculated
     *   for the current ad break only from the player API.
     * @param totalNumberOfAds if specified, {totalAdsCount} will be set to this value. Can be used to calculate the total
     *   number of ads across multiple ad breaks which are scheduled for the same time. If not provided, the value will
     *   be calculated for the current ad break only from the player API.
     * @returns {string} the ad message with filled placeholders
     */
    function replaceAdMessagePlaceholders(adMessage: string, player: PlayerAPI, skipOffset?: number, activeAdIndex?: number, totalNumberOfAds?: number): string;
}
