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
exports.SubtitleSwitchHandler = void 0;
var i18n_1 = require("../localization/i18n");
/**
 * Helper class to handle all subtitle related events
 *
 * This class listens to player events as well as the `ListSelector` event if selection changed
 *
 * @category Utils
 */
var SubtitleSwitchHandler = /** @class */ (function () {
    function SubtitleSwitchHandler(player, element, uimanager) {
        var _this = this;
        this.onSubtitleEnabled = function (event) {
            var _a;
            _this.selectCurrentSubtitle();
            // Update UI language to match subtitle language
            if (i18n_1.i18n.getConfig().adaptLocalizationToSubtitleLanguage) {
                var lang = typeof ((_a = event.subtitle) === null || _a === void 0 ? void 0 : _a.lang) === 'string' ? event.subtitle.lang.trim() : '';
                if (lang) {
                    i18n_1.i18n.setLanguage(lang);
                }
            }
        };
        this.addSubtitle = function (event) {
            var addedSubtitle = event.subtitle;
            if (!_this.hasComparator()) {
                if (!_this.listElement.hasItem(addedSubtitle.id)) {
                    _this.listElement.addItem(addedSubtitle.id, addedSubtitle.label);
                }
                return;
            }
            var availableSubtitles = _this.player.subtitles.list();
            var mergedSubtitles = availableSubtitles.some(function (track) { return track.id === addedSubtitle.id; })
                ? availableSubtitles
                : __spreadArray(__spreadArray([], availableSubtitles, true), [addedSubtitle], false);
            var offListItem = {
                key: SubtitleSwitchHandler.SUBTITLES_OFF_KEY,
                label: i18n_1.i18n.getLocalizer('off'),
            };
            _this.listElement.synchronizeItems(__spreadArray([
                offListItem
            ], mergedSubtitles.map(function (subtitle) { return _this.subtitleToListItem(subtitle); }), true));
            _this.selectCurrentSubtitle();
        };
        this.removeSubtitle = function (event) {
            var subtitle = event.subtitle;
            if (_this.listElement.hasItem(subtitle.id)) {
                _this.listElement.removeItem(subtitle.id);
            }
            _this.selectCurrentSubtitle();
        };
        this.selectCurrentSubtitle = function () {
            if (!_this.player.subtitles) {
                // Subtitles API not available (yet)
                return;
            }
            var currentSubtitle = _this.player.subtitles
                .list()
                .filter(function (subtitle) { return subtitle.enabled; })
                .pop();
            _this.listElement.selectItem(currentSubtitle ? currentSubtitle.id : SubtitleSwitchHandler.SUBTITLES_OFF_KEY);
        };
        this.clearSubtitles = function () {
            _this.listElement.clearItems();
        };
        this.refreshSubtitles = function () {
            if (!_this.player.subtitles) {
                // Subtitles API not available (yet)
                return;
            }
            var offListItem = {
                key: SubtitleSwitchHandler.SUBTITLES_OFF_KEY,
                label: i18n_1.i18n.getLocalizer('off'),
            };
            _this.listElement.synchronizeItems(__spreadArray([
                offListItem
            ], _this.player.subtitles.list().map(function (subtitle) { return _this.subtitleToListItem(subtitle); }), true));
            _this.selectCurrentSubtitle();
        };
        this.player = player;
        this.listElement = element;
        this.uimanager = uimanager;
        this.bindSelectionEvent();
        this.bindPlayerEvents();
        this.refreshSubtitles();
    }
    SubtitleSwitchHandler.prototype.bindSelectionEvent = function () {
        var _this = this;
        this.listElement.onItemSelectionChanged.subscribe(function (_, value) {
            // TODO add support for multiple concurrent subtitle selections
            if (value === SubtitleSwitchHandler.SUBTITLES_OFF_KEY) {
                var currentSubtitle = _this.player.subtitles
                    .list()
                    .filter(function (subtitle) { return subtitle.enabled; })
                    .pop();
                if (currentSubtitle) {
                    _this.player.subtitles.disable(currentSubtitle.id);
                }
            }
            else {
                _this.player.subtitles.enable(value, true);
            }
        });
    };
    SubtitleSwitchHandler.prototype.bindPlayerEvents = function () {
        this.player.on(this.player.exports.PlayerEvent.SubtitleAdded, this.addSubtitle);
        this.player.on(this.player.exports.PlayerEvent.SubtitleEnabled, this.onSubtitleEnabled);
        this.player.on(this.player.exports.PlayerEvent.SubtitleDisabled, this.selectCurrentSubtitle);
        this.player.on(this.player.exports.PlayerEvent.SubtitleRemoved, this.removeSubtitle);
        // Update subtitles when source goes away
        this.player.on(this.player.exports.PlayerEvent.SourceUnloaded, this.clearSubtitles);
        // Update subtitles when the period within a source changes
        this.player.on(this.player.exports.PlayerEvent.PeriodSwitched, this.refreshSubtitles);
        this.uimanager.getConfig().events.onUpdated.subscribe(this.refreshSubtitles);
    };
    SubtitleSwitchHandler.prototype.hasComparator = function () {
        return this.listElement.getConfig().comparator != null;
    };
    SubtitleSwitchHandler.prototype.subtitleToListItem = function (subtitle) {
        return { key: subtitle.id, label: subtitle.label };
    };
    SubtitleSwitchHandler.SUBTITLES_OFF_KEY = 'null';
    return SubtitleSwitchHandler;
}());
exports.SubtitleSwitchHandler = SubtitleSwitchHandler;
