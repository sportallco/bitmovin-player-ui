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
exports.UIFactory = void 0;
var SubtitleOverlay_1 = require("./components/overlays/SubtitleOverlay");
var SettingsPanelPage_1 = require("./components/settings/SettingsPanelPage");
var VideoQualitySelectBox_1 = require("./components/settings/VideoQualitySelectBox");
var PlaybackSpeedSelectBox_1 = require("./components/settings/PlaybackSpeedSelectBox");
var AudioTrackSelectBox_1 = require("./components/settings/AudioTrackSelectBox");
var AudioQualitySelectBox_1 = require("./components/settings/AudioQualitySelectBox");
var SettingsPanel_1 = require("./components/settings/SettingsPanel");
var SubtitleSettingsPanelPage_1 = require("./components/settings/subtitlesettings/SubtitleSettingsPanelPage");
var SettingsPanelPageOpenButton_1 = require("./components/settings/SettingsPanelPageOpenButton");
var SubtitleSelectBox_1 = require("./components/settings/SubtitleSelectBox");
var ControlBar_1 = require("./components/ControlBar");
var Container_1 = require("./components/Container");
var AdCounterLabel_1 = require("./components/ads/AdCounterLabel");
var PlaybackTimeLabel_1 = require("./components/labels/PlaybackTimeLabel");
var SeekBar_1 = require("./components/seekbar/SeekBar");
var SeekBarLabel_1 = require("./components/seekbar/SeekBarLabel");
var PlaybackToggleButton_1 = require("./components/buttons/PlaybackToggleButton");
var VolumeToggleButton_1 = require("./components/buttons/VolumeToggleButton");
var VolumeSlider_1 = require("./components/seekbar/VolumeSlider");
var Spacer_1 = require("./components/Spacer");
var PictureInPictureToggleButton_1 = require("./components/buttons/PictureInPictureToggleButton");
var AirPlayToggleButton_1 = require("./components/buttons/AirPlayToggleButton");
var CastToggleButton_1 = require("./components/buttons/CastToggleButton");
var VRToggleButton_1 = require("./components/buttons/VRToggleButton");
var SettingsToggleButton_1 = require("./components/settings/SettingsToggleButton");
var FullscreenToggleButton_1 = require("./components/buttons/FullscreenToggleButton");
var UIContainer_1 = require("./components/UIContainer");
var BufferingOverlay_1 = require("./components/overlays/BufferingOverlay");
var PlayerContextMenu_1 = require("./components/contextmenu/PlayerContextMenu");
var PlaybackToggleOverlay_1 = require("./components/overlays/PlaybackToggleOverlay");
var CastStatusOverlay_1 = require("./components/overlays/CastStatusOverlay");
var TitleBar_1 = require("./components/TitleBar");
var RecommendationOverlay_1 = require("./components/overlays/RecommendationOverlay");
var Watermark_1 = require("./components/Watermark");
var ErrorMessageOverlay_1 = require("./components/overlays/ErrorMessageOverlay");
var AdClickOverlay_1 = require("./components/ads/AdClickOverlay");
var AdControlBar_1 = require("./components/ads/AdControlBar");
var MetadataLabel_1 = require("./components/labels/MetadataLabel");
var PlayerUtils_1 = require("./utils/PlayerUtils");
var CastUIContainer_1 = require("./components/CastUIContainer");
var UIManager_1 = require("./UIManager");
var i18n_1 = require("./localization/i18n");
var SubtitleListBox_1 = require("./components/lists/SubtitleListBox");
var AudioTrackListBox_1 = require("./components/lists/AudioTrackListBox");
var SpatialNavigation_1 = require("./spatialnavigation/SpatialNavigation");
var RootNavigationGroup_1 = require("./spatialnavigation/RootNavigationGroup");
var SettingsPanelNavigationGroup_1 = require("./spatialnavigation/SettingsPanelNavigationGroup");
var EcoModeContainer_1 = require("./components/EcoModeContainer");
var PersistentPreferencesToggleButton_1 = require("./components/buttons/PersistentPreferencesToggleButton");
var DynamicSettingsPanelItem_1 = require("./components/settings/DynamicSettingsPanelItem");
var ToggleSettingsPanelItem_1 = require("./components/settings/ToggleSettingsPanelItem");
var Label_1 = require("./components/labels/Label");
var TouchControlOverlay_1 = require("./components/overlays/TouchControlOverlay");
var AdStatusOverlay_1 = require("./components/ads/AdStatusOverlay");
var DismissClickOverlay_1 = require("./components/overlays/DismissClickOverlay");
var AdMessageLabel_1 = require("./components/ads/AdMessageLabel");
var FocusableContainer_1 = require("./spatialnavigation/FocusableContainer");
var BrowserUtils_1 = require("./utils/BrowserUtils");
var RecommendationOverlayNavigationGroup_1 = require("./spatialnavigation/RecommendationOverlayNavigationGroup");
var PlayerInsightsPanel_1 = require("./components/panels/player-insights/PlayerInsightsPanel");
/**
 * Provides factory methods to create Bitmovin provided UIs.
 */
var UIFactory;
(function (UIFactory) {
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
    function buildUI(player, config) {
        if (config === void 0) { config = {}; }
        var smallScreenSwitchWidth = 800;
        return new UIManager_1.UIManager(player, [
            {
                ui: UIFactory.defaultLayouts.emptyState,
                condition: function (context) {
                    return !context.isSourceLoaded;
                },
                identifier: UIManager_1.UIVariantIdentifier.empty,
            },
            {
                ui: UIFactory.defaultLayouts.smallScreenAds,
                condition: function (context) {
                    return context.documentWidth < smallScreenSwitchWidth && context.isAd && context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.smallScreenAds,
            },
            {
                ui: UIFactory.defaultLayouts.smallScreen,
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi && context.documentWidth < smallScreenSwitchWidth;
                },
                identifier: UIManager_1.UIVariantIdentifier.smallScreen,
            },
            {
                ui: UIFactory.defaultLayouts.tvAds,
                condition: function (context) {
                    return context.isTv && context.isAd && context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.tvAds,
            },
            {
                ui: UIFactory.defaultLayouts.tv,
                condition: function (context) {
                    return context.isTv && !context.isAd && !context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.tv,
            },
            {
                ui: UIFactory.defaultLayouts.ads,
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.ads,
            },
            {
                ui: function () { return UIFactory.defaultLayouts.main(config); },
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.main,
            },
        ], config);
    }
    UIFactory.buildUI = buildUI;
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
    function buildSmallScreenUI(player, config) {
        if (config === void 0) { config = {}; }
        return new UIManager_1.UIManager(player, [
            {
                ui: UIFactory.defaultLayouts.smallScreenAds,
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.smallScreenAds,
            },
            {
                ui: UIFactory.defaultLayouts.smallScreen,
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.smallScreen,
            },
        ], config);
    }
    UIFactory.buildSmallScreenUI = buildSmallScreenUI;
    /**
     * Builds a UI which is used on cast receivers.
     *
     * This UI includes variants for:
     * - Cast Receivers
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildCastReceiverUI(player, config) {
        if (config === void 0) { config = {}; }
        return new UIManager_1.UIManager(player, [
            {
                ui: function () { return UIFactory.defaultLayouts.castReceiver(config); },
                identifier: UIManager_1.UIVariantIdentifier.castReceiver,
            },
        ], config);
    }
    UIFactory.buildCastReceiverUI = buildCastReceiverUI;
    /**
     * Builds a UI which is used on TVs.
     *
     * This UI includes variants for:
     * - TVs
     *
     * @param player The player instance used to build the UI
     * @param config The UIConfig object
     */
    function buildTvUI(player, config) {
        if (config === void 0) { config = {}; }
        return new UIManager_1.UIManager(player, [
            {
                ui: UIFactory.defaultLayouts.tvAds,
                condition: function (context) {
                    return context.isAd && context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.tvAds,
            },
            {
                ui: UIFactory.defaultLayouts.tv,
                condition: function (context) {
                    return !context.isAd && !context.adRequiresUi;
                },
                identifier: UIManager_1.UIVariantIdentifier.tv,
            },
        ], config);
    }
    UIFactory.buildTvUI = buildTvUI;
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
    function buildSubtitleUI(player, config) {
        if (config === void 0) { config = {}; }
        return new UIManager_1.UIManager(player, [
            {
                ui: UIFactory.defaultLayouts.subtitle,
                identifier: UIManager_1.UIVariantIdentifier.subtitle,
            },
        ], config);
    }
    UIFactory.buildSubtitleUI = buildSubtitleUI;
    /**
     * Default layout functions which are used to build the default UI.
     *
     * Using these methods enables customization of certain aspects of the default UI without recreating all UI variants.
     * They can be used to recreate the default UI while changing the conditions based on which variant switching happens.
     */
    var defaultLayouts;
    (function (defaultLayouts) {
        function subtitle() {
            var subtitleOverlay = new SubtitleOverlay_1.SubtitleOverlay();
            // Subtitle styling only works if a `SubtitleSettingsPanelPage` (with the corresponding Subtitle Settings elements)
            // are in the UI tree.
            var settingsPanel = new SettingsPanel_1.SettingsPanel({
                components: [],
                hidden: true,
            });
            var subtitleSettingsPanelPage = new SubtitleSettingsPanelPage_1.SubtitleSettingsPanelPage({
                settingsPanel: settingsPanel,
                overlay: subtitleOverlay,
            });
            settingsPanel.addComponent(subtitleSettingsPanelPage);
            // Create a custom UI structure with only the SubtitleOverlay (and the hidden SettingsPanel to enable UI customizations)
            return new UIContainer_1.UIContainer({
                components: [subtitleOverlay, settingsPanel],
            });
        }
        defaultLayouts.subtitle = subtitle;
        function main(config) {
            if (config === void 0) { config = {}; }
            var subtitleOverlay = new SubtitleOverlay_1.SubtitleOverlay();
            var playerInsightsPanel = BrowserUtils_1.BrowserUtils.isMobile ? null : new PlayerInsightsPanel_1.PlayerInsightsPanel({ hidden: true });
            var playerContextMenu = playerInsightsPanel ? new PlayerContextMenu_1.PlayerContextMenu({ playerInsightsPanel: playerInsightsPanel }) : null;
            var settingsPanel = buildDefaultSettingsPanel(subtitleOverlay, undefined, config.ecoMode === true, config.showPersistentPreferencesToggle === true && config.disableStorageApi !== true);
            var controlBar = new ControlBar_1.ControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.CurrentTime,
                                hideInLivePlayback: true,
                            }),
                            new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() }),
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.TotalTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['controlbar-top'],
                    }),
                    new Container_1.Container({
                        components: [
                            new PlaybackToggleButton_1.PlaybackToggleButton(),
                            new VolumeToggleButton_1.VolumeToggleButton(),
                            new VolumeSlider_1.VolumeSlider(),
                            new Spacer_1.Spacer(),
                            new PictureInPictureToggleButton_1.PictureInPictureToggleButton(),
                            new AirPlayToggleButton_1.AirPlayToggleButton(),
                            new CastToggleButton_1.CastToggleButton(),
                            new VRToggleButton_1.VRToggleButton(),
                            new SettingsToggleButton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                            new FullscreenToggleButton_1.FullscreenToggleButton(),
                        ],
                        cssClasses: ['controlbar-bottom'],
                    }),
                ],
            });
            var conditionalComponents = __spreadArray(__spreadArray([
                config.includeWatermark ? new Watermark_1.Watermark() : null
            ], (playerInsightsPanel ? [playerInsightsPanel] : []), true), (playerContextMenu ? [new DismissClickOverlay_1.DismissClickOverlay({ target: playerContextMenu }), playerContextMenu] : []), true).filter(function (e) { return e; });
            return new UIContainer_1.UIContainer({
                components: __spreadArray(__spreadArray([
                    subtitleOverlay,
                    new BufferingOverlay_1.BufferingOverlay(),
                    new PlaybackToggleOverlay_1.PlaybackToggleOverlay(),
                    new CastStatusOverlay_1.CastStatusOverlay(),
                    controlBar,
                    new TitleBar_1.TitleBar(),
                    new RecommendationOverlay_1.RecommendationOverlay()
                ], conditionalComponents, true), [
                    new DismissClickOverlay_1.DismissClickOverlay({ target: settingsPanel }),
                    settingsPanel,
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ], false),
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
            });
        }
        defaultLayouts.main = main;
        function ads() {
            var controlBar = new AdControlBar_1.AdControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new AdCounterLabel_1.AdCounterLabel(),
                            new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() }),
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.RemainingTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['ad-controlbar-top'],
                    }),
                    new Container_1.Container({
                        components: [
                            new PlaybackToggleButton_1.PlaybackToggleButton(),
                            new VolumeToggleButton_1.VolumeToggleButton(),
                            new Spacer_1.Spacer(),
                            new FullscreenToggleButton_1.FullscreenToggleButton(),
                        ],
                        cssClasses: ['ad-controlbar-bottom'],
                    }),
                ],
            });
            return new UIContainer_1.UIContainer({
                components: [
                    new BufferingOverlay_1.BufferingOverlay(),
                    new AdClickOverlay_1.AdClickOverlay(),
                    new PlaybackToggleOverlay_1.PlaybackToggleOverlay(),
                    new AdStatusOverlay_1.AdStatusOverlay(),
                    controlBar,
                    new TitleBar_1.TitleBar({
                        components: [
                            new Container_1.Container({
                                components: [new AdMessageLabel_1.AdMessageLabel()],
                                cssClasses: ['ui-titlebar-top'],
                            }),
                        ],
                        keepHiddenWithoutMetadata: true,
                    }),
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
                cssClasses: ['ui-ads'],
            });
        }
        defaultLayouts.ads = ads;
        function smallScreen() {
            var subtitleOverlay = new SubtitleOverlay_1.SubtitleOverlay();
            var playerInsightsPanel = BrowserUtils_1.BrowserUtils.isMobile ? null : new PlayerInsightsPanel_1.PlayerInsightsPanel({ hidden: true });
            var playerContextMenu = playerInsightsPanel ? new PlayerContextMenu_1.PlayerContextMenu({ playerInsightsPanel: playerInsightsPanel }) : null;
            var settingsPanel = buildDefaultSettingsPanel(subtitleOverlay, -1);
            var controlBar = new ControlBar_1.ControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.CurrentTime,
                                hideInLivePlayback: true,
                            }),
                            new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() }),
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.TotalTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['controlbar-top'],
                    }),
                    new Container_1.Container({
                        components: [
                            new PlaybackToggleButton_1.PlaybackToggleButton(),
                            new VolumeToggleButton_1.VolumeToggleButton(),
                            new VolumeSlider_1.VolumeSlider(),
                            new Spacer_1.Spacer(),
                            new PictureInPictureToggleButton_1.PictureInPictureToggleButton(),
                            new SettingsToggleButton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                            new FullscreenToggleButton_1.FullscreenToggleButton(),
                        ],
                        cssClasses: ['controlbar-bottom'],
                    }),
                ],
            });
            return new UIContainer_1.UIContainer({
                components: __spreadArray(__spreadArray(__spreadArray(__spreadArray([
                    subtitleOverlay,
                    new BufferingOverlay_1.BufferingOverlay(),
                    new CastStatusOverlay_1.CastStatusOverlay(),
                    // Use the touch overlay on mobile devices and the regular playback toggle overlay on desktop browsers
                    BrowserUtils_1.BrowserUtils.isMobile || BrowserUtils_1.BrowserUtils.isTouchSupported
                        ? new TouchControlOverlay_1.TouchControlOverlay()
                        : new PlaybackToggleOverlay_1.PlaybackToggleOverlay(),
                    new RecommendationOverlay_1.RecommendationOverlay(),
                    controlBar,
                    new TitleBar_1.TitleBar({
                        components: [
                            new Container_1.Container({
                                components: [
                                    new MetadataLabel_1.MetadataLabel({ content: MetadataLabel_1.MetadataLabelContent.Title }),
                                    new Spacer_1.Spacer(),
                                    new CastToggleButton_1.CastToggleButton(),
                                    new AirPlayToggleButton_1.AirPlayToggleButton(),
                                    new VRToggleButton_1.VRToggleButton(),
                                ],
                                cssClasses: ['titlebar-row'],
                            }),
                        ],
                    })
                ], (playerInsightsPanel ? [playerInsightsPanel] : []), true), [
                    new DismissClickOverlay_1.DismissClickOverlay({ target: settingsPanel }),
                    settingsPanel
                ], false), (playerContextMenu ? [new DismissClickOverlay_1.DismissClickOverlay({ target: playerContextMenu }), playerContextMenu] : []), true), [
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ], false),
                cssClasses: ['ui-smallscreen'],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
            });
        }
        defaultLayouts.smallScreen = smallScreen;
        function smallScreenAds() {
            var controlBar = new AdControlBar_1.AdControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.CurrentTime }),
                            new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() }),
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.TotalTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['ad-controlbar-top'],
                    }),
                    new Container_1.Container({
                        components: [
                            new PlaybackToggleButton_1.PlaybackToggleButton(),
                            new VolumeToggleButton_1.VolumeToggleButton(),
                            new Spacer_1.Spacer(),
                            new FullscreenToggleButton_1.FullscreenToggleButton(),
                        ],
                        cssClasses: ['ad-controlbar-bottom'],
                    }),
                ],
            });
            return new UIContainer_1.UIContainer({
                components: [
                    new BufferingOverlay_1.BufferingOverlay(),
                    new AdClickOverlay_1.AdClickOverlay(),
                    new PlaybackToggleOverlay_1.PlaybackToggleOverlay(),
                    controlBar,
                    new TitleBar_1.TitleBar({
                        components: [
                            new Container_1.Container({
                                components: [new AdMessageLabel_1.AdMessageLabel()],
                                cssClasses: ['ui-titlebar-top'],
                            }),
                        ],
                        keepHiddenWithoutMetadata: true,
                    }),
                    new AdStatusOverlay_1.AdStatusOverlay(),
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
                cssClasses: ['ui-smallscreen', 'ui-ads'],
            });
        }
        defaultLayouts.smallScreenAds = smallScreenAds;
        function castReceiver(config) {
            if (config === void 0) { config = {}; }
            var controlBar = new ControlBar_1.ControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.CurrentTime,
                                hideInLivePlayback: true,
                            }),
                            new SeekBar_1.SeekBar({ smoothPlaybackPositionUpdateIntervalMs: -1 }),
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.TotalTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['controlbar-top'],
                    }),
                ],
            });
            var conditionalComponents = [config.includeWatermark ? new Watermark_1.Watermark() : null].filter(function (e) { return e; });
            return new CastUIContainer_1.CastUIContainer({
                components: __spreadArray(__spreadArray([
                    new SubtitleOverlay_1.SubtitleOverlay(),
                    new BufferingOverlay_1.BufferingOverlay(),
                    new PlaybackToggleOverlay_1.PlaybackToggleOverlay(),
                    controlBar,
                    new TitleBar_1.TitleBar({ keepHiddenWithoutMetadata: true })
                ], conditionalComponents, true), [
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ], false),
                cssClasses: ['ui-cast-receiver'],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
            });
        }
        defaultLayouts.castReceiver = castReceiver;
        function tv() {
            var seekBar = new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() });
            var subtitleOverlay = new SubtitleOverlay_1.SubtitleOverlay();
            var settingsPanel = buildDefaultSettingsPanel(subtitleOverlay, 5000);
            var subtitleListBox = new SubtitleListBox_1.SubtitleListBox({ title: i18n_1.i18n.getLocalizer('settings.subtitles') });
            var subtitleListBoxOpenButton = new SettingsToggleButton_1.SettingsToggleButton({
                settingsPanel: subtitleListBox,
                autoHideWhenNoActiveSettings: true,
                cssClass: 'ui-subtitle-list-box-toggle-button',
                text: i18n_1.i18n.getLocalizer('settings.subtitles'),
            });
            var audioListBox = new AudioTrackListBox_1.AudioTrackListBox({ title: i18n_1.i18n.getLocalizer('settings.audio.track') });
            var audioListBoxToggleButton = new SettingsToggleButton_1.SettingsToggleButton({
                settingsPanel: audioListBox,
                autoHideWhenNoActiveSettings: true,
                cssClass: 'ui-audio-track-list-box-toggle-button',
                text: i18n_1.i18n.getLocalizer('settings.audio.track'),
            });
            var titleBar = new TitleBar_1.TitleBar({
                components: [
                    new Container_1.Container({
                        components: [new MetadataLabel_1.MetadataLabel({ content: MetadataLabel_1.MetadataLabelContent.Title })],
                        cssClasses: ['ui-titlebar-top'],
                    }),
                    new Container_1.Container({
                        components: [new MetadataLabel_1.MetadataLabel({ content: MetadataLabel_1.MetadataLabelContent.Description })],
                        cssClasses: ['ui-titlebar-bottom'],
                    }),
                ],
            });
            var playbackToggleButton = new PlaybackToggleButton_1.PlaybackToggleButton();
            var bottomControlBar = new Container_1.Container({
                components: [
                    playbackToggleButton,
                    new Spacer_1.Spacer(),
                    subtitleListBoxOpenButton,
                    audioListBoxToggleButton,
                    new SettingsToggleButton_1.SettingsToggleButton({ settingsPanel: settingsPanel }),
                ],
                cssClasses: ['controlbar-bottom'],
            });
            var controlBar = new ControlBar_1.ControlBar({
                components: [
                    new Container_1.Container({
                        components: [
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.CurrentTime,
                                hideInLivePlayback: true,
                            }),
                            seekBar,
                            new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.TotalTime,
                                cssClasses: ['text-right'],
                            }),
                        ],
                        cssClasses: ['controlbar-top'],
                    }),
                    bottomControlBar,
                ],
            });
            var playbackToggleOverlay = new PlaybackToggleOverlay_1.PlaybackToggleOverlay();
            var recommendationOverlay = new RecommendationOverlay_1.RecommendationOverlay();
            var uiContainer = new UIContainer_1.UIContainer({
                components: [
                    subtitleOverlay,
                    new BufferingOverlay_1.BufferingOverlay(),
                    playbackToggleOverlay,
                    controlBar,
                    titleBar,
                    settingsPanel,
                    subtitleListBox,
                    audioListBox,
                    recommendationOverlay,
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ],
                cssClasses: ['ui-tv'],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
            });
            var spatialNavigation = new SpatialNavigation_1.SpatialNavigation(new RootNavigationGroup_1.RootNavigationGroup(uiContainer, playbackToggleOverlay, seekBar, new FocusableContainer_1.FocusableContainer(bottomControlBar, playbackToggleButton)), new SettingsPanelNavigationGroup_1.SettingsPanelNavigationGroup(settingsPanel, { closeOnSelect: false }), new SettingsPanelNavigationGroup_1.SettingsPanelNavigationGroup(subtitleListBox), new SettingsPanelNavigationGroup_1.SettingsPanelNavigationGroup(audioListBox), new RecommendationOverlayNavigationGroup_1.RecommendationOverlayNavigationGroup(recommendationOverlay));
            return {
                ui: uiContainer,
                spatialNavigation: spatialNavigation,
            };
        }
        defaultLayouts.tv = tv;
        function tvAds() {
            var playbackToggleOverlay = new PlaybackToggleOverlay_1.PlaybackToggleOverlay();
            var adStatusOverlay = new AdStatusOverlay_1.AdStatusOverlay();
            var uiContainer = new UIContainer_1.UIContainer({
                components: [
                    new BufferingOverlay_1.BufferingOverlay(),
                    new AdClickOverlay_1.AdClickOverlay(),
                    playbackToggleOverlay,
                    adStatusOverlay,
                    new AdControlBar_1.AdControlBar({
                        components: [
                            new Container_1.Container({
                                components: [
                                    new AdCounterLabel_1.AdCounterLabel(),
                                    new SeekBar_1.SeekBar({ label: new SeekBarLabel_1.SeekBarLabel() }),
                                    new PlaybackTimeLabel_1.PlaybackTimeLabel({
                                        timeLabelMode: PlaybackTimeLabel_1.PlaybackTimeLabelMode.RemainingTime,
                                        cssClasses: ['text-right'],
                                    }),
                                ],
                                cssClasses: ['ad-controlbar-top'],
                            }),
                        ],
                    }),
                    new TitleBar_1.TitleBar({
                        components: [
                            new Container_1.Container({
                                components: [new AdMessageLabel_1.AdMessageLabel()],
                                cssClasses: ['ui-titlebar-top'],
                            }),
                        ],
                        keepHiddenWithoutMetadata: true,
                    }),
                    new ErrorMessageOverlay_1.ErrorMessageOverlay(),
                ],
                cssClasses: ['ui-tv', 'ui-ads'],
                hidePlayerStateExceptions: [
                    PlayerUtils_1.PlayerUtils.PlayerState.Prepared,
                    PlayerUtils_1.PlayerUtils.PlayerState.Paused,
                    PlayerUtils_1.PlayerUtils.PlayerState.Finished,
                ],
            });
            var spatialNavigation = new SpatialNavigation_1.SpatialNavigation(new RootNavigationGroup_1.RootNavigationGroup(uiContainer, playbackToggleOverlay, adStatusOverlay.adSkipButton));
            return {
                ui: uiContainer,
                spatialNavigation: spatialNavigation,
            };
        }
        defaultLayouts.tvAds = tvAds;
        /**
         * Used for the initial startup phase of the UI. Only contains basic components.
         */
        function emptyState() {
            return new UIContainer_1.UIContainer({
                components: [new BufferingOverlay_1.BufferingOverlay(), new PlaybackToggleOverlay_1.PlaybackToggleOverlay(), new ErrorMessageOverlay_1.ErrorMessageOverlay()],
                cssClasses: ['ui', 'ui-empty-state'],
            });
        }
        defaultLayouts.emptyState = emptyState;
    })(defaultLayouts = UIFactory.defaultLayouts || (UIFactory.defaultLayouts = {}));
    function buildDefaultSettingsPanel(subtitleOverlay, hideDelay, enableEcoMode, showPersistentPreferencesToggle) {
        if (hideDelay === void 0) { hideDelay = undefined; }
        if (enableEcoMode === void 0) { enableEcoMode = false; }
        if (showPersistentPreferencesToggle === void 0) { showPersistentPreferencesToggle = false; }
        var settingsPanelConfig = {
            components: [],
            hidden: true,
            pageTransitionAnimation: true,
        };
        if (hideDelay != undefined) {
            settingsPanelConfig.hideDelay = hideDelay;
        }
        var settingsPanel = new SettingsPanel_1.SettingsPanel(settingsPanelConfig);
        var components = [
            new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
                label: i18n_1.i18n.getLocalizer('settings.video.quality'),
                settingComponent: new VideoQualitySelectBox_1.VideoQualitySelectBox(),
                container: settingsPanel,
            }),
            new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
                label: i18n_1.i18n.getLocalizer('speed'),
                settingComponent: new PlaybackSpeedSelectBox_1.PlaybackSpeedSelectBox(),
                container: settingsPanel,
            }),
            new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
                label: i18n_1.i18n.getLocalizer('settings.audio.track'),
                settingComponent: new AudioTrackSelectBox_1.AudioTrackSelectBox(),
                container: settingsPanel,
            }),
            new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
                label: i18n_1.i18n.getLocalizer('settings.audio.quality'),
                settingComponent: new AudioQualitySelectBox_1.AudioQualitySelectBox(),
                container: settingsPanel,
            }),
        ];
        if (enableEcoMode) {
            var ecoModeContainer = new EcoModeContainer_1.EcoModeContainer();
            ecoModeContainer.setOnToggleCallback(function () {
                // forces the browser to re-calculate the height of the settings panel when adding/removing elements
                settingsPanel.getDomElement().css({ width: '', height: '' });
            });
            components.unshift(ecoModeContainer);
        }
        var mainSettingsPanelPage = new SettingsPanelPage_1.SettingsPanelPage({
            components: components,
        });
        settingsPanel.addComponent(mainSettingsPanelPage);
        var subtitleSettingsPanelPage = new SubtitleSettingsPanelPage_1.SubtitleSettingsPanelPage({
            settingsPanel: settingsPanel,
            overlay: subtitleOverlay,
            useDynamicSettingsPanelItem: true,
        });
        var subtitleSettingsOpenButton = new SettingsPanelPageOpenButton_1.SettingsPanelPageOpenButton({
            targetPage: subtitleSettingsPanelPage,
            container: settingsPanel,
            ariaLabel: i18n_1.i18n.getLocalizer('settings.subtitles'),
            text: i18n_1.i18n.getLocalizer('settings.subtitles.options'),
        });
        var subtitleSelectBox = new SubtitleSelectBox_1.SubtitleSelectBox();
        var subtitleSelectItem = new DynamicSettingsPanelItem_1.DynamicSettingsPanelItem({
            label: i18n_1.i18n.getLocalizer('settings.subtitles'),
            backNavigationRightComponent: subtitleSettingsOpenButton,
            settingComponent: subtitleSelectBox,
            container: settingsPanel,
        });
        mainSettingsPanelPage.addComponent(subtitleSelectItem);
        settingsPanel.addComponent(subtitleSettingsPanelPage);
        // Added last so the opt-in toggle sits at the bottom of the settings list, out of the
        // way of the primary playback settings.
        if (showPersistentPreferencesToggle) {
            var persistentPreferencesToggle = new PersistentPreferencesToggleButton_1.PersistentPreferencesToggleButton();
            var persistentPreferencesLabel = new Label_1.Label({
                text: i18n_1.i18n.getLocalizer('persistentPreferences'),
                for: persistentPreferencesToggle.getConfig().id,
            });
            mainSettingsPanelPage.addComponent(new ToggleSettingsPanelItem_1.ToggleSettingsPanelItem({
                label: persistentPreferencesLabel,
                settingComponent: persistentPreferencesToggle,
            }));
        }
        return settingsPanel;
    }
})(UIFactory || (exports.UIFactory = UIFactory = {}));
