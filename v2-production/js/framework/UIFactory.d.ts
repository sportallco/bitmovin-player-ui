import { UIContainer } from './components/UIContainer';
import { UIManager, UIVariant } from './UIManager';
import { UIConfig } from './UIConfig';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Provides factory methods to create Bitmovin provided UIs.
 */
export declare namespace UIFactory {
    /**
     * Builds a fully featured UI with all Bitmovin provided variants.
     * The UI will automatically switch between the different variants based on the current context.
     *
     * This UI includes variants for:
     * - Default UI (without additional context checks)
     * - Ads
     * - Small Screens (e.g. mobile devices)
     * - Small Screen Ads
     * - TVs
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildUI(player: PlayerAPI, config?: UIConfig): UIManager;
    /**
     * Builds a UI for small screens (e.g. mobile devices) only.
     * This UI is optimized for small screens and touch input.
     *
     * This UI includes variants for:
     * - Small Screens (e.g. mobile devices)
     * - Small Screen Ads
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildSmallScreenUI(player: PlayerAPI, config?: UIConfig): UIManager;
    /**
     * Builds a UI which is used on cast receivers.
     *
     * This UI includes variants for:
     * - Cast Receivers
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildCastReceiverUI(player: PlayerAPI, config?: UIConfig): UIManager;
    /**
     * Builds a UI which is used on TVs.
     *
     * This UI includes variants for:
     * - TVs
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildTvUI(player: PlayerAPI, config?: UIConfig): UIManager;
    /**
     * Builds a simple UI which only contains the subtitle overlay, and elements required to support programmatic
     * subtitle styling (e.g. using `uiManager.getSubtitleSettingsManager().fontSize.value = '150'`).
     *
     * This UI has no visible UI elements and only serves the purpose of displaying subtitles. Subtitles need to be
     * enabled programmatically via the Player API.
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildSubtitleUI(player: PlayerAPI, config?: UIConfig): UIManager;
    /**
     * Default layout functions which are used to build the default UI.
     *
     * Using these methods enables customization of certain aspects of the default UI without recreating all UI variants.
     * They can be used to recreate the default UI while changing the conditions based on which variant switching happens.
     */
    namespace defaultLayouts {
        function subtitle(): UIContainer;
        function main(config?: UIConfig): UIContainer;
        function ads(): UIContainer;
        function smallScreen(): UIContainer;
        function smallScreenAds(): UIContainer;
        function castReceiver(config?: UIConfig): UIContainer;
        function tv(): Pick<UIVariant, 'ui' | 'spatialNavigation'>;
        function tvAds(): Pick<UIVariant, 'ui' | 'spatialNavigation'>;
        /**
         * Used for the initial startup phase of the UI. Only contains basic components.
         */
        function emptyState(): UIContainer;
    }
}
