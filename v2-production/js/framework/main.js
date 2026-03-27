"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekBarLabel = exports.RecommendationItem = exports.RecommendationOverlay = exports.ErrorMessageOverlay = exports.ViewMode = exports.Component = exports.CastToggleButton = exports.CastStatusOverlay = exports.AudioTrackSelectBox = exports.AudioQualitySelectBox = exports.LabelStyle = exports.Label = exports.Container = exports.UIContainer = exports.Watermark = exports.VRToggleButton = exports.VolumeToggleButton = exports.VideoQualitySelectBox = exports.ToggleButton = exports.SettingsToggleButton = exports.NavigationDirection = exports.SettingsPanel = exports.ItemSelectionList = exports.SelectBox = exports.SeekBar = exports.PlaybackToggleButton = exports.PlaybackTimeLabelMode = exports.PlaybackTimeLabel = exports.HugePlaybackToggleButton = exports.FullscreenToggleButton = exports.ControlBar = exports.ButtonStyle = exports.Button = exports.SettingsPanelNavigationGroupConfig = exports.SettingsPanelNavigationGroup = exports.RootNavigationGroup = exports.NavigationGroup = exports.SpatialNavigation = exports.I18n = exports.i18n = exports.ShadowDomManager = exports.ErrorUtils = exports.StorageUtils = exports.BrowserUtils = exports.UIUtils = exports.PlayerUtils = exports.StringUtils = exports.ArrayUtils = exports.UIFactory = exports.version = void 0;
exports.EcoModeContainer = exports.DismissClickOverlay = exports.Icon = exports.AdStatusOverlay = exports.ListSelector = exports.QuickSeekButton = exports.ReplayButton = exports.DynamicSettingsPanelItem = exports.SettingsPanelItem = exports.SubtitleSettingsPanelPage = exports.SettingsPanelPageOpenButton = exports.SettingsPanelPageBackButton = exports.SettingsPanelPage = exports.AudioTrackListBox = exports.SubtitleListBox = exports.ListBox = exports.SubtitleSettingsResetButton = exports.WindowOpacitySelectBox = exports.WindowColorSelectBox = exports.SubtitleSettingSelectBox = exports.FontSizeSelectBox = exports.FontOpacitySelectBox = exports.FontFamilySelectBox = exports.FontColorSelectBox = exports.CharacterEdgeSelectBox = exports.BackgroundOpacitySelectBox = exports.BackgroundColorSelectBox = exports.Spacer = exports.PictureInPictureToggleButton = exports.VolumeSlider = exports.AirPlayToggleButton = exports.MetadataLabelContent = exports.MetadataLabel = exports.BackButton = exports.CloseButton = exports.PlaybackToggleOverlay = exports.CastUIContainer = exports.BufferingOverlay = exports.HugeReplayButton = exports.PlaybackSpeedSelectBox = exports.AdCounterLabel = exports.AdClickOverlay = exports.AdMessageLabel = exports.AdControlBar = exports.AdSkipButton = exports.ClickOverlay = exports.VolumeControlButton = exports.TitleBar = exports.SubtitleSelectBox = exports.SubtitleOverlay = void 0;
exports.FontStyleSelectBox = exports.CharacterEdgeColorSelectBox = exports.TouchControlOverlay = exports.InteractiveSettingsPanelItem = exports.SettingsPanelPageNavigatorButton = exports.SettingsPanelSelectOption = exports.SmallCenteredPlaybackToggleButton = exports.TvNoiseCanvas = exports.EcoModeToggleButton = void 0;
exports.version = '{{VERSION}}';
// Management
__exportStar(require("./UIManager"), exports);
__exportStar(require("./UIConfig"), exports);
// Factories
var UIFactory_1 = require("./UIFactory");
Object.defineProperty(exports, "UIFactory", { enumerable: true, get: function () { return UIFactory_1.UIFactory; } });
// Utils
var ArrayUtils_1 = require("./utils/ArrayUtils");
Object.defineProperty(exports, "ArrayUtils", { enumerable: true, get: function () { return ArrayUtils_1.ArrayUtils; } });
var StringUtils_1 = require("./utils/StringUtils");
Object.defineProperty(exports, "StringUtils", { enumerable: true, get: function () { return StringUtils_1.StringUtils; } });
var PlayerUtils_1 = require("./utils/PlayerUtils");
Object.defineProperty(exports, "PlayerUtils", { enumerable: true, get: function () { return PlayerUtils_1.PlayerUtils; } });
var UIUtils_1 = require("./utils/UIUtils");
Object.defineProperty(exports, "UIUtils", { enumerable: true, get: function () { return UIUtils_1.UIUtils; } });
var BrowserUtils_1 = require("./utils/BrowserUtils");
Object.defineProperty(exports, "BrowserUtils", { enumerable: true, get: function () { return BrowserUtils_1.BrowserUtils; } });
var StorageUtils_1 = require("./utils/StorageUtils");
Object.defineProperty(exports, "StorageUtils", { enumerable: true, get: function () { return StorageUtils_1.StorageUtils; } });
var ErrorUtils_1 = require("./utils/ErrorUtils");
Object.defineProperty(exports, "ErrorUtils", { enumerable: true, get: function () { return ErrorUtils_1.ErrorUtils; } });
var ShadowDomManager_1 = require("./utils/ShadowDomManager");
Object.defineProperty(exports, "ShadowDomManager", { enumerable: true, get: function () { return ShadowDomManager_1.ShadowDomManager; } });
// Localization
var i18n_1 = require("./localization/i18n");
Object.defineProperty(exports, "i18n", { enumerable: true, get: function () { return i18n_1.i18n; } });
Object.defineProperty(exports, "I18n", { enumerable: true, get: function () { return i18n_1.I18n; } });
// Spatial Navigation
var SpatialNavigation_1 = require("./spatialnavigation/SpatialNavigation");
Object.defineProperty(exports, "SpatialNavigation", { enumerable: true, get: function () { return SpatialNavigation_1.SpatialNavigation; } });
var NavigationGroup_1 = require("./spatialnavigation/NavigationGroup");
Object.defineProperty(exports, "NavigationGroup", { enumerable: true, get: function () { return NavigationGroup_1.NavigationGroup; } });
var RootNavigationGroup_1 = require("./spatialnavigation/RootNavigationGroup");
Object.defineProperty(exports, "RootNavigationGroup", { enumerable: true, get: function () { return RootNavigationGroup_1.RootNavigationGroup; } });
var SettingsPanelNavigationGroup_1 = require("./spatialnavigation/SettingsPanelNavigationGroup");
Object.defineProperty(exports, "SettingsPanelNavigationGroup", { enumerable: true, get: function () { return SettingsPanelNavigationGroup_1.SettingsPanelNavigationGroup; } });
Object.defineProperty(exports, "SettingsPanelNavigationGroupConfig", { enumerable: true, get: function () { return SettingsPanelNavigationGroup_1.SettingsPanelNavigationGroupConfig; } });
// Components
var Button_1 = require("./components/buttons/Button");
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return Button_1.Button; } });
Object.defineProperty(exports, "ButtonStyle", { enumerable: true, get: function () { return Button_1.ButtonStyle; } });
var ControlBar_1 = require("./components/ControlBar");
Object.defineProperty(exports, "ControlBar", { enumerable: true, get: function () { return ControlBar_1.ControlBar; } });
var FullscreenToggleButton_1 = require("./components/buttons/FullscreenToggleButton");
Object.defineProperty(exports, "FullscreenToggleButton", { enumerable: true, get: function () { return FullscreenToggleButton_1.FullscreenToggleButton; } });
var HugePlaybackToggleButton_1 = require("./components/buttons/HugePlaybackToggleButton");
Object.defineProperty(exports, "HugePlaybackToggleButton", { enumerable: true, get: function () { return HugePlaybackToggleButton_1.HugePlaybackToggleButton; } });
var PlaybackTimeLabel_1 = require("./components/labels/PlaybackTimeLabel");
Object.defineProperty(exports, "PlaybackTimeLabel", { enumerable: true, get: function () { return PlaybackTimeLabel_1.PlaybackTimeLabel; } });
Object.defineProperty(exports, "PlaybackTimeLabelMode", { enumerable: true, get: function () { return PlaybackTimeLabel_1.PlaybackTimeLabelMode; } });
var PlaybackToggleButton_1 = require("./components/buttons/PlaybackToggleButton");
Object.defineProperty(exports, "PlaybackToggleButton", { enumerable: true, get: function () { return PlaybackToggleButton_1.PlaybackToggleButton; } });
var SeekBar_1 = require("./components/seekbar/SeekBar");
Object.defineProperty(exports, "SeekBar", { enumerable: true, get: function () { return SeekBar_1.SeekBar; } });
var SelectBox_1 = require("./components/settings/SelectBox");
Object.defineProperty(exports, "SelectBox", { enumerable: true, get: function () { return SelectBox_1.SelectBox; } });
var ItemSelectionList_1 = require("./components/lists/ItemSelectionList");
Object.defineProperty(exports, "ItemSelectionList", { enumerable: true, get: function () { return ItemSelectionList_1.ItemSelectionList; } });
var SettingsPanel_1 = require("./components/settings/SettingsPanel");
Object.defineProperty(exports, "SettingsPanel", { enumerable: true, get: function () { return SettingsPanel_1.SettingsPanel; } });
Object.defineProperty(exports, "NavigationDirection", { enumerable: true, get: function () { return SettingsPanel_1.NavigationDirection; } });
var SettingsToggleButton_1 = require("./components/settings/SettingsToggleButton");
Object.defineProperty(exports, "SettingsToggleButton", { enumerable: true, get: function () { return SettingsToggleButton_1.SettingsToggleButton; } });
var ToggleButton_1 = require("./components/buttons/ToggleButton");
Object.defineProperty(exports, "ToggleButton", { enumerable: true, get: function () { return ToggleButton_1.ToggleButton; } });
var VideoQualitySelectBox_1 = require("./components/settings/VideoQualitySelectBox");
Object.defineProperty(exports, "VideoQualitySelectBox", { enumerable: true, get: function () { return VideoQualitySelectBox_1.VideoQualitySelectBox; } });
var VolumeToggleButton_1 = require("./components/buttons/VolumeToggleButton");
Object.defineProperty(exports, "VolumeToggleButton", { enumerable: true, get: function () { return VolumeToggleButton_1.VolumeToggleButton; } });
var VRToggleButton_1 = require("./components/buttons/VRToggleButton");
Object.defineProperty(exports, "VRToggleButton", { enumerable: true, get: function () { return VRToggleButton_1.VRToggleButton; } });
var Watermark_1 = require("./components/Watermark");
Object.defineProperty(exports, "Watermark", { enumerable: true, get: function () { return Watermark_1.Watermark; } });
var UIContainer_1 = require("./components/UIContainer");
Object.defineProperty(exports, "UIContainer", { enumerable: true, get: function () { return UIContainer_1.UIContainer; } });
var Container_1 = require("./components/Container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return Container_1.Container; } });
var Label_1 = require("./components/labels/Label");
Object.defineProperty(exports, "Label", { enumerable: true, get: function () { return Label_1.Label; } });
Object.defineProperty(exports, "LabelStyle", { enumerable: true, get: function () { return Label_1.LabelStyle; } });
var AudioQualitySelectBox_1 = require("./components/settings/AudioQualitySelectBox");
Object.defineProperty(exports, "AudioQualitySelectBox", { enumerable: true, get: function () { return AudioQualitySelectBox_1.AudioQualitySelectBox; } });
var AudioTrackSelectBox_1 = require("./components/settings/AudioTrackSelectBox");
Object.defineProperty(exports, "AudioTrackSelectBox", { enumerable: true, get: function () { return AudioTrackSelectBox_1.AudioTrackSelectBox; } });
var CastStatusOverlay_1 = require("./components/overlays/CastStatusOverlay");
Object.defineProperty(exports, "CastStatusOverlay", { enumerable: true, get: function () { return CastStatusOverlay_1.CastStatusOverlay; } });
var CastToggleButton_1 = require("./components/buttons/CastToggleButton");
Object.defineProperty(exports, "CastToggleButton", { enumerable: true, get: function () { return CastToggleButton_1.CastToggleButton; } });
var Component_1 = require("./components/Component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return Component_1.Component; } });
Object.defineProperty(exports, "ViewMode", { enumerable: true, get: function () { return Component_1.ViewMode; } });
var ErrorMessageOverlay_1 = require("./components/overlays/ErrorMessageOverlay");
Object.defineProperty(exports, "ErrorMessageOverlay", { enumerable: true, get: function () { return ErrorMessageOverlay_1.ErrorMessageOverlay; } });
var RecommendationOverlay_1 = require("./components/overlays/RecommendationOverlay");
Object.defineProperty(exports, "RecommendationOverlay", { enumerable: true, get: function () { return RecommendationOverlay_1.RecommendationOverlay; } });
var RecommendationItem_1 = require("./components/RecommendationItem");
Object.defineProperty(exports, "RecommendationItem", { enumerable: true, get: function () { return RecommendationItem_1.RecommendationItem; } });
var SeekBarLabel_1 = require("./components/seekbar/SeekBarLabel");
Object.defineProperty(exports, "SeekBarLabel", { enumerable: true, get: function () { return SeekBarLabel_1.SeekBarLabel; } });
var SubtitleOverlay_1 = require("./components/overlays/SubtitleOverlay");
Object.defineProperty(exports, "SubtitleOverlay", { enumerable: true, get: function () { return SubtitleOverlay_1.SubtitleOverlay; } });
var SubtitleSelectBox_1 = require("./components/settings/SubtitleSelectBox");
Object.defineProperty(exports, "SubtitleSelectBox", { enumerable: true, get: function () { return SubtitleSelectBox_1.SubtitleSelectBox; } });
var TitleBar_1 = require("./components/TitleBar");
Object.defineProperty(exports, "TitleBar", { enumerable: true, get: function () { return TitleBar_1.TitleBar; } });
var VolumeControlButton_1 = require("./components/buttons/VolumeControlButton");
Object.defineProperty(exports, "VolumeControlButton", { enumerable: true, get: function () { return VolumeControlButton_1.VolumeControlButton; } });
var ClickOverlay_1 = require("./components/overlays/ClickOverlay");
Object.defineProperty(exports, "ClickOverlay", { enumerable: true, get: function () { return ClickOverlay_1.ClickOverlay; } });
var AdSkipButton_1 = require("./components/ads/AdSkipButton");
Object.defineProperty(exports, "AdSkipButton", { enumerable: true, get: function () { return AdSkipButton_1.AdSkipButton; } });
var AdControlBar_1 = require("./components/ads/AdControlBar");
Object.defineProperty(exports, "AdControlBar", { enumerable: true, get: function () { return AdControlBar_1.AdControlBar; } });
var AdMessageLabel_1 = require("./components/ads/AdMessageLabel");
Object.defineProperty(exports, "AdMessageLabel", { enumerable: true, get: function () { return AdMessageLabel_1.AdMessageLabel; } });
var AdClickOverlay_1 = require("./components/ads/AdClickOverlay");
Object.defineProperty(exports, "AdClickOverlay", { enumerable: true, get: function () { return AdClickOverlay_1.AdClickOverlay; } });
var AdCounterLabel_1 = require("./components/ads/AdCounterLabel");
Object.defineProperty(exports, "AdCounterLabel", { enumerable: true, get: function () { return AdCounterLabel_1.AdCounterLabel; } });
var PlaybackSpeedSelectBox_1 = require("./components/settings/PlaybackSpeedSelectBox");
Object.defineProperty(exports, "PlaybackSpeedSelectBox", { enumerable: true, get: function () { return PlaybackSpeedSelectBox_1.PlaybackSpeedSelectBox; } });
var HugeReplayButton_1 = require("./components/buttons/HugeReplayButton");
Object.defineProperty(exports, "HugeReplayButton", { enumerable: true, get: function () { return HugeReplayButton_1.HugeReplayButton; } });
var BufferingOverlay_1 = require("./components/overlays/BufferingOverlay");
Object.defineProperty(exports, "BufferingOverlay", { enumerable: true, get: function () { return BufferingOverlay_1.BufferingOverlay; } });
var CastUIContainer_1 = require("./components/CastUIContainer");
Object.defineProperty(exports, "CastUIContainer", { enumerable: true, get: function () { return CastUIContainer_1.CastUIContainer; } });
var PlaybackToggleOverlay_1 = require("./components/overlays/PlaybackToggleOverlay");
Object.defineProperty(exports, "PlaybackToggleOverlay", { enumerable: true, get: function () { return PlaybackToggleOverlay_1.PlaybackToggleOverlay; } });
var CloseButton_1 = require("./components/buttons/CloseButton");
Object.defineProperty(exports, "CloseButton", { enumerable: true, get: function () { return CloseButton_1.CloseButton; } });
var BackButton_1 = require("./components/buttons/BackButton");
Object.defineProperty(exports, "BackButton", { enumerable: true, get: function () { return BackButton_1.BackButton; } });
var MetadataLabel_1 = require("./components/labels/MetadataLabel");
Object.defineProperty(exports, "MetadataLabel", { enumerable: true, get: function () { return MetadataLabel_1.MetadataLabel; } });
Object.defineProperty(exports, "MetadataLabelContent", { enumerable: true, get: function () { return MetadataLabel_1.MetadataLabelContent; } });
var AirPlayToggleButton_1 = require("./components/buttons/AirPlayToggleButton");
Object.defineProperty(exports, "AirPlayToggleButton", { enumerable: true, get: function () { return AirPlayToggleButton_1.AirPlayToggleButton; } });
var VolumeSlider_1 = require("./components/seekbar/VolumeSlider");
Object.defineProperty(exports, "VolumeSlider", { enumerable: true, get: function () { return VolumeSlider_1.VolumeSlider; } });
var PictureInPictureToggleButton_1 = require("./components/buttons/PictureInPictureToggleButton");
Object.defineProperty(exports, "PictureInPictureToggleButton", { enumerable: true, get: function () { return PictureInPictureToggleButton_1.PictureInPictureToggleButton; } });
var Spacer_1 = require("./components/Spacer");
Object.defineProperty(exports, "Spacer", { enumerable: true, get: function () { return Spacer_1.Spacer; } });
var BackgroundColorSelectBox_1 = require("./components/settings/subtitlesettings/BackgroundColorSelectBox");
Object.defineProperty(exports, "BackgroundColorSelectBox", { enumerable: true, get: function () { return BackgroundColorSelectBox_1.BackgroundColorSelectBox; } });
var BackgroundOpacitySelectBox_1 = require("./components/settings/subtitlesettings/BackgroundOpacitySelectBox");
Object.defineProperty(exports, "BackgroundOpacitySelectBox", { enumerable: true, get: function () { return BackgroundOpacitySelectBox_1.BackgroundOpacitySelectBox; } });
var CharacterEdgeSelectBox_1 = require("./components/settings/subtitlesettings/CharacterEdgeSelectBox");
Object.defineProperty(exports, "CharacterEdgeSelectBox", { enumerable: true, get: function () { return CharacterEdgeSelectBox_1.CharacterEdgeSelectBox; } });
var FontColorSelectBox_1 = require("./components/settings/subtitlesettings/FontColorSelectBox");
Object.defineProperty(exports, "FontColorSelectBox", { enumerable: true, get: function () { return FontColorSelectBox_1.FontColorSelectBox; } });
var FontFamilySelectBox_1 = require("./components/settings/subtitlesettings/FontFamilySelectBox");
Object.defineProperty(exports, "FontFamilySelectBox", { enumerable: true, get: function () { return FontFamilySelectBox_1.FontFamilySelectBox; } });
var FontOpacitySelectBox_1 = require("./components/settings/subtitlesettings/FontOpacitySelectBox");
Object.defineProperty(exports, "FontOpacitySelectBox", { enumerable: true, get: function () { return FontOpacitySelectBox_1.FontOpacitySelectBox; } });
var FontSizeSelectBox_1 = require("./components/settings/subtitlesettings/FontSizeSelectBox");
Object.defineProperty(exports, "FontSizeSelectBox", { enumerable: true, get: function () { return FontSizeSelectBox_1.FontSizeSelectBox; } });
var SubtitleSettingSelectBox_1 = require("./components/settings/subtitlesettings/SubtitleSettingSelectBox");
Object.defineProperty(exports, "SubtitleSettingSelectBox", { enumerable: true, get: function () { return SubtitleSettingSelectBox_1.SubtitleSettingSelectBox; } });
var WindowColorSelectBox_1 = require("./components/settings/subtitlesettings/WindowColorSelectBox");
Object.defineProperty(exports, "WindowColorSelectBox", { enumerable: true, get: function () { return WindowColorSelectBox_1.WindowColorSelectBox; } });
var WindowOpacitySelectBox_1 = require("./components/settings/subtitlesettings/WindowOpacitySelectBox");
Object.defineProperty(exports, "WindowOpacitySelectBox", { enumerable: true, get: function () { return WindowOpacitySelectBox_1.WindowOpacitySelectBox; } });
var SubtitleSettingsResetButton_1 = require("./components/settings/subtitlesettings/SubtitleSettingsResetButton");
Object.defineProperty(exports, "SubtitleSettingsResetButton", { enumerable: true, get: function () { return SubtitleSettingsResetButton_1.SubtitleSettingsResetButton; } });
var ListBox_1 = require("./components/lists/ListBox");
Object.defineProperty(exports, "ListBox", { enumerable: true, get: function () { return ListBox_1.ListBox; } });
var SubtitleListBox_1 = require("./components/lists/SubtitleListBox");
Object.defineProperty(exports, "SubtitleListBox", { enumerable: true, get: function () { return SubtitleListBox_1.SubtitleListBox; } });
var AudioTrackListBox_1 = require("./components/lists/AudioTrackListBox");
Object.defineProperty(exports, "AudioTrackListBox", { enumerable: true, get: function () { return AudioTrackListBox_1.AudioTrackListBox; } });
var SettingsPanelPage_1 = require("./components/settings/SettingsPanelPage");
Object.defineProperty(exports, "SettingsPanelPage", { enumerable: true, get: function () { return SettingsPanelPage_1.SettingsPanelPage; } });
var SettingsPanelPageBackButton_1 = require("./components/settings/SettingsPanelPageBackButton");
Object.defineProperty(exports, "SettingsPanelPageBackButton", { enumerable: true, get: function () { return SettingsPanelPageBackButton_1.SettingsPanelPageBackButton; } });
var SettingsPanelPageOpenButton_1 = require("./components/settings/SettingsPanelPageOpenButton");
Object.defineProperty(exports, "SettingsPanelPageOpenButton", { enumerable: true, get: function () { return SettingsPanelPageOpenButton_1.SettingsPanelPageOpenButton; } });
var SubtitleSettingsPanelPage_1 = require("./components/settings/subtitlesettings/SubtitleSettingsPanelPage");
Object.defineProperty(exports, "SubtitleSettingsPanelPage", { enumerable: true, get: function () { return SubtitleSettingsPanelPage_1.SubtitleSettingsPanelPage; } });
var SettingsPanelItem_1 = require("./components/settings/SettingsPanelItem");
Object.defineProperty(exports, "SettingsPanelItem", { enumerable: true, get: function () { return SettingsPanelItem_1.SettingsPanelItem; } });
var DynamicSettingsPanelItem_1 = require("./components/settings/DynamicSettingsPanelItem");
Object.defineProperty(exports, "DynamicSettingsPanelItem", { enumerable: true, get: function () { return DynamicSettingsPanelItem_1.DynamicSettingsPanelItem; } });
var ReplayButton_1 = require("./components/buttons/ReplayButton");
Object.defineProperty(exports, "ReplayButton", { enumerable: true, get: function () { return ReplayButton_1.ReplayButton; } });
var QuickSeekButton_1 = require("./components/buttons/QuickSeekButton");
Object.defineProperty(exports, "QuickSeekButton", { enumerable: true, get: function () { return QuickSeekButton_1.QuickSeekButton; } });
var ListSelector_1 = require("./components/lists/ListSelector");
Object.defineProperty(exports, "ListSelector", { enumerable: true, get: function () { return ListSelector_1.ListSelector; } });
var AdStatusOverlay_1 = require("./components/ads/AdStatusOverlay");
Object.defineProperty(exports, "AdStatusOverlay", { enumerable: true, get: function () { return AdStatusOverlay_1.AdStatusOverlay; } });
var Icon_1 = require("./components/Icon");
Object.defineProperty(exports, "Icon", { enumerable: true, get: function () { return Icon_1.Icon; } });
var DismissClickOverlay_1 = require("./components/overlays/DismissClickOverlay");
Object.defineProperty(exports, "DismissClickOverlay", { enumerable: true, get: function () { return DismissClickOverlay_1.DismissClickOverlay; } });
var EcoModeContainer_1 = require("./components/EcoModeContainer");
Object.defineProperty(exports, "EcoModeContainer", { enumerable: true, get: function () { return EcoModeContainer_1.EcoModeContainer; } });
var EcoModeToggleButton_1 = require("./components/buttons/EcoModeToggleButton");
Object.defineProperty(exports, "EcoModeToggleButton", { enumerable: true, get: function () { return EcoModeToggleButton_1.EcoModeToggleButton; } });
var TvNoiseCanvas_1 = require("./components/TvNoiseCanvas");
Object.defineProperty(exports, "TvNoiseCanvas", { enumerable: true, get: function () { return TvNoiseCanvas_1.TvNoiseCanvas; } });
var SmallCenteredPlaybackToggleButton_1 = require("./components/buttons/SmallCenteredPlaybackToggleButton");
Object.defineProperty(exports, "SmallCenteredPlaybackToggleButton", { enumerable: true, get: function () { return SmallCenteredPlaybackToggleButton_1.SmallCenteredPlaybackToggleButton; } });
var SettingsPanelSelectOption_1 = require("./components/settings/SettingsPanelSelectOption");
Object.defineProperty(exports, "SettingsPanelSelectOption", { enumerable: true, get: function () { return SettingsPanelSelectOption_1.SettingsPanelSelectOption; } });
var SettingsPanelPageNavigatorButton_1 = require("./components/settings/SettingsPanelPageNavigatorButton");
Object.defineProperty(exports, "SettingsPanelPageNavigatorButton", { enumerable: true, get: function () { return SettingsPanelPageNavigatorButton_1.SettingsPanelPageNavigatorButton; } });
var InteractiveSettingsPanelItem_1 = require("./components/settings/InteractiveSettingsPanelItem");
Object.defineProperty(exports, "InteractiveSettingsPanelItem", { enumerable: true, get: function () { return InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem; } });
var TouchControlOverlay_1 = require("./components/overlays/TouchControlOverlay");
Object.defineProperty(exports, "TouchControlOverlay", { enumerable: true, get: function () { return TouchControlOverlay_1.TouchControlOverlay; } });
var CharacterEdgeColorSelectBox_1 = require("./components/settings/subtitlesettings/CharacterEdgeColorSelectBox");
Object.defineProperty(exports, "CharacterEdgeColorSelectBox", { enumerable: true, get: function () { return CharacterEdgeColorSelectBox_1.CharacterEdgeColorSelectBox; } });
var FontStyleSelectBox_1 = require("./components/settings/subtitlesettings/FontStyleSelectBox");
Object.defineProperty(exports, "FontStyleSelectBox", { enumerable: true, get: function () { return FontStyleSelectBox_1.FontStyleSelectBox; } });
// Object.assign polyfill for ES5/IE9
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
