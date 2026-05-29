"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleRegionContainer = exports.SubtitleRegionContainerManager = exports.SubtitleLabel = exports.SubtitleOverlay = void 0;
var Container_1 = require("../Container");
var Label_1 = require("../labels/Label");
var ControlBar_1 = require("../ControlBar");
var EventDispatcher_1 = require("../../EventDispatcher");
var DOM_1 = require("../../DOM");
var i18n_1 = require("../../localization/i18n");
var VttUtils_1 = require("../../utils/VttUtils");
/**
 * Overlays the player to display subtitles.
 *
 * @category Components
 */
var SubtitleOverlay = /** @class */ (function (_super) {
    __extends(SubtitleOverlay, _super);
    function SubtitleOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.preprocessLabelEventCallback = new EventDispatcher_1.EventDispatcher();
        _this.cea608Enabled = false;
        _this.cea608FontSizeFactor = 1;
        _this.cea608SmallPlayerHeightThreshold = SubtitleOverlay.DEFAULT_CEA608_SMALL_PLAYER_HEIGHT_THRESHOLD;
        _this.filterFontSizeOptions = function (listItem) {
            if (_this.cea608Enabled && listItem.key !== null) {
                var percent = parseInt(listItem.key, 10);
                return !isNaN(percent) && percent <= 200;
            }
            return true;
        };
        _this.previewSubtitleActive = false;
        _this.previewSubtitle = new SubtitleLabel({ text: i18n_1.i18n.getLocalizer('subtitle.example') });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-overlay',
            enableCea608CaptionFormatting: true,
        }, _this.config);
        return _this;
    }
    SubtitleOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var uiConfig = uimanager.getConfig();
        if (uiConfig.cea608SmallPlayerHeightThreshold !== undefined) {
            this.cea608SmallPlayerHeightThreshold = uiConfig.cea608SmallPlayerHeightThreshold;
        }
        var subtitleManager = new ActiveSubtitleManager();
        this.subtitleManager = subtitleManager;
        this.subtitleContainerManager = new SubtitleRegionContainerManager(this);
        player.on(player.exports.PlayerEvent.CueEnter, function (event) {
            var label = _this.generateLabel(event);
            subtitleManager.cueEnter(event, label);
            _this.preprocessLabelEventCallback.dispatch(event, label);
            if (_this.previewSubtitleActive) {
                _this.subtitleContainerManager.removeLabel(_this.previewSubtitle);
            }
            _this.show();
            _this.subtitleContainerManager.addLabel(label, _this.getDomElement().size());
            _this.updateComponents();
            if (uimanager.getConfig().forceSubtitlesIntoViewContainer) {
                _this.handleSubtitleCropping(label);
            }
        });
        player.on(player.exports.PlayerEvent.CueUpdate, function (event) {
            var label = _this.generateLabel(event);
            var labelToReplace = subtitleManager.cueUpdate(event, label);
            _this.preprocessLabelEventCallback.dispatch(event, label);
            if (labelToReplace) {
                _this.subtitleContainerManager.replaceLabel(labelToReplace, label, _this.getDomElement().size());
                _this.updateComponents();
            }
            if (uimanager.getConfig().forceSubtitlesIntoViewContainer) {
                _this.handleSubtitleCropping(label);
            }
        });
        player.on(player.exports.PlayerEvent.CueExit, function (event) {
            var labelToRemove = subtitleManager.cueExit(event);
            if (labelToRemove) {
                _this.subtitleContainerManager.removeLabel(labelToRemove);
                _this.updateComponents();
            }
            if (!subtitleManager.hasCues) {
                if (!_this.previewSubtitleActive) {
                    _this.hide();
                }
                else {
                    _this.subtitleContainerManager.addLabel(_this.previewSubtitle);
                    _this.updateComponents();
                }
            }
        });
        var subtitleClearHandler = function () {
            _this.hide();
            _this.subtitleContainerManager.clear();
            subtitleManager.clear();
            _this.removeComponents();
            _this.updateComponents();
        };
        var clearInactiveCues = function () {
            var removedActiveCues = subtitleManager.clearInactiveCues(player.getCurrentTime());
            removedActiveCues.forEach(function (toRemove) {
                _this.subtitleContainerManager.removeLabel(toRemove.label);
            });
            _this.updateComponents();
        };
        player.on(player.exports.PlayerEvent.AudioChanged, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.SubtitleDisabled, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.Seeked, clearInactiveCues);
        player.on(player.exports.PlayerEvent.TimeShifted, clearInactiveCues);
        player.on(player.exports.PlayerEvent.PlaybackFinished, subtitleClearHandler);
        player.on(player.exports.PlayerEvent.SourceUnloaded, subtitleClearHandler);
        uimanager.onComponentShow.subscribe(function (component) {
            if (component instanceof ControlBar_1.ControlBar) {
                _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
                var isCea608PushupTransitionEnabled = !_this.getDomElement().hasClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA608_PUSHUP_DISABLED));
                if (_this.cea608Enabled && _this.ensureCea608GridSizeUpdated && isCea608PushupTransitionEnabled) {
                    awaitTransitionEnd(_this.getDomElement()).then(_this.ensureCea608GridSizeUpdated);
                }
            }
        });
        uimanager.onComponentHide.subscribe(function (component) {
            if (component instanceof ControlBar_1.ControlBar) {
                _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE));
                var isCea608PushupTransitionEnabled = !_this.getDomElement().hasClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA608_PUSHUP_DISABLED));
                if (_this.cea608Enabled && _this.ensureCea608GridSizeUpdated && isCea608PushupTransitionEnabled) {
                    awaitTransitionEnd(_this.getDomElement()).then(_this.ensureCea608GridSizeUpdated);
                }
            }
        });
        this.configureCea608Captions(player, uimanager);
        // Init
        subtitleClearHandler();
        this.updateCea608PushupFromPlayerHeight(new DOM_1.DOM(player.getContainer()).height());
    };
    SubtitleOverlay.prototype.updateCea608PushupFromPlayerHeight = function (playerHeight) {
        if (this.cea608SmallPlayerHeightThreshold > 0 && playerHeight <= this.cea608SmallPlayerHeightThreshold) {
            this.getDomElement().addClass(this.prefixCss(SubtitleOverlay.CLASS_CEA608_PUSHUP_DISABLED));
        }
        else {
            this.getDomElement().removeClass(this.prefixCss(SubtitleOverlay.CLASS_CEA608_PUSHUP_DISABLED));
        }
    };
    SubtitleOverlay.prototype.setFontSizeFactor = function (factor) {
        // We only allow range from 50% to 200% as suggested by spec
        // https://www.ecfr.gov/current/title-47/part-79/section-79.103#p-79.103(c)(4)
        this.cea608FontSizeFactor = Math.max(0.5, Math.min(2, factor));
    };
    SubtitleOverlay.prototype.detectCroppedSubtitleLabel = function (labelElement) {
        var parent = this.getDomElement().get(0);
        var childRect = labelElement.getBoundingClientRect();
        var parentRect = parent.getBoundingClientRect();
        return {
            top: childRect.top < parentRect.top,
            right: childRect.right > parentRect.right,
            bottom: childRect.bottom > parentRect.bottom,
            left: childRect.left < parentRect.left,
        };
    };
    SubtitleOverlay.prototype.handleSubtitleCropping = function (label) {
        var labelDomElement = label.getDomElement();
        var cropDetection = this.detectCroppedSubtitleLabel(labelDomElement.get(0));
        if (cropDetection.top) {
            labelDomElement.css('top', '0');
            labelDomElement.removeCss('bottom');
        }
        if (cropDetection.right) {
            labelDomElement.css('right', '0');
            labelDomElement.removeCss('left');
        }
        if (cropDetection.bottom) {
            labelDomElement.css('bottom', '0');
            labelDomElement.removeCss('top');
        }
        if (cropDetection.left) {
            labelDomElement.css('left', '0');
            labelDomElement.removeCss('right');
        }
    };
    SubtitleOverlay.prototype.generateLabel = function (event) {
        var _a;
        // Sanitize cue data (must be done before the cue ID is generated in subtitleManager.cueEnter / update)
        var region = event.region;
        // Sometimes the positions are undefined, we assume them to be zero.
        // We need to keep track of the original row position in case of recalculation.
        var originalRowNumber = ((_a = event.position) === null || _a === void 0 ? void 0 : _a.row) || 0;
        if (isCea608SubtitleCue(event)) {
            event.position.row = event.position.row || 0;
            event.position.column = event.position.column || 0;
            region = region || "cea608-row-".concat(event.position.row);
        }
        var label = new SubtitleLabel({
            // Prefer the HTML subtitle text if set, else try generating a image tag as string from the image attribute,
            // else use the plain text
            text: event.html || ActiveSubtitleManager.generateImageTagText(event.image) || event.text,
            cssClasses: event.vtt && !event.vtt.region ? ['subtitle-vtt-cue'] : [],
            vtt: event.vtt,
            region: region,
            regionStyle: event.regionStyle,
            originalRowPosition: originalRowNumber,
        });
        return label;
    };
    SubtitleOverlay.prototype.resolveFontSizeFactor = function (value) {
        return parseInt(value) / 100;
    };
    SubtitleOverlay.prototype.configureCea608Captions = function (player, uimanager) {
        var _this = this;
        var _a;
        /** The calculated row height in px */
        var rowHeight = 0;
        /** The calculated font size in px */
        var fontSize = 0;
        /**
         * The ratio of the font size of 100% to the row height.
         * e.g. font size 100% fills up 75% of the available row height
         */
        var fontSize100PercentRatio = 0.75;
        /** The required letter spacing spread the text characters evenly across the grid */
        var fontLetterSpacing = 0;
        /** The ratio of the caption window/row height that is used as margin so that the window encloses the caption */
        var windowMarginRatio = 0.2;
        /** The calculated window margin in px */
        var windowMargin;
        /** Flag telling if the CEA-608 rendering mode is currently enabled */
        this.cea608Enabled = false;
        /** Track last known grid params to avoid unnecessary recalculations */
        var lastCeaGridRecalculation = { overlayWidth: 0, overlayHeight: 0, fontSizeFactor: 0 };
        var settingsManager = uimanager.getSubtitleSettingsManager();
        if (settingsManager.fontSize.value != null) {
            var fontSizeFactorSettings = this.resolveFontSizeFactor(settingsManager.fontSize.value);
            this.setFontSizeFactor(fontSizeFactorSettings);
        }
        settingsManager.fontSize.onChanged.subscribe(function (_sender, property) {
            if (property.isSet()) {
                // We need to convert from percent
                var factorValue = _this.resolveFontSizeFactor(property.value);
                _this.setFontSizeFactor(factorValue);
            }
            else {
                _this.setFontSizeFactor(1);
            }
            if (_this.cea608Enabled) {
                _this.ensureCea608GridSizeUpdated();
            }
        });
        (_a = this.onShow) === null || _a === void 0 ? void 0 : _a.subscribe(function () {
            // ensure CEA grid is updated whenever the overlay becomes visible
            if (_this.cea608Enabled) {
                _this.ensureCea608GridSizeUpdated();
            }
        });
        this.ensureCea608GridSizeUpdated = function () {
            var overlayElement = _this.getDomElement();
            var currentWidth = overlayElement.width();
            var currentHeight = overlayElement.height();
            var hasOverlaySizeChanged = currentWidth !== lastCeaGridRecalculation.overlayWidth ||
                currentHeight !== lastCeaGridRecalculation.overlayHeight;
            var hasFontSizeFactorChanged = _this.cea608FontSizeFactor !== lastCeaGridRecalculation.fontSizeFactor;
            if (!hasOverlaySizeChanged && !hasFontSizeFactorChanged) {
                // none of the input variables changed, no need to recalculate
                return;
            }
            lastCeaGridRecalculation = {
                overlayWidth: currentWidth,
                overlayHeight: currentHeight,
                fontSizeFactor: _this.cea608FontSizeFactor,
            };
            var dummyLabel = new SubtitleLabel({ text: 'X' });
            dummyLabel.getDomElement().css({
                // By using a large font size we do not need to use multiple letters and can get still an
                // accurate measurement even though the returned size is an integer value
                'font-size': '200px',
                'line-height': '200px',
                visibility: 'hidden',
            });
            _this.addComponent(dummyLabel);
            _this.updateComponents();
            _this.show();
            var dummyLabelCharWidth = dummyLabel.getDomElement().width();
            var dummyLabelCharHeight = dummyLabel.getDomElement().height();
            var fontSizeRatio = dummyLabelCharWidth / dummyLabelCharHeight;
            _this.removeComponent(dummyLabel);
            _this.updateComponents();
            if (!_this.subtitleManager.hasCues) {
                _this.hide();
            }
            // We subtract 1px here to avoid line breaks at the right border of the subtitle overlay that can happen
            // when texts contain whitespaces. It's probably some kind of pixel rounding issue in the browser's
            // layouting, but the actual reason could not be determined. Aiming for a target width - 1px would work in
            // most browsers, but Safari has a "quantized" font size rendering with huge steps in between so we need
            // to subtract some more pixels to avoid line breaks there as well.
            var subtitleOverlayWidthUsableRatio = 1 - parseFloat(SubtitleOverlay.DEFAULT_CAPTION_LEFT_OFFSET) / 100;
            var subtitleOverlayWidth = Math.floor(subtitleOverlayWidthUsableRatio * currentWidth) - 10;
            var subtitleOverlayHeight = currentHeight;
            // The size ratio of the letter grid
            var fontGridSizeRatio = (dummyLabelCharWidth * SubtitleOverlay.CEA608_NUM_COLUMNS) /
                (dummyLabelCharHeight * SubtitleOverlay.CEA608_NUM_ROWS);
            // The size ratio of the available space for the grid
            var subtitleOverlaySizeRatio = subtitleOverlayWidth / subtitleOverlayHeight;
            if (subtitleOverlaySizeRatio > fontGridSizeRatio) {
                // When the available space is wider than the text grid, the font size is simply
                // determined by the height of the available space.
                rowHeight = subtitleOverlayHeight / SubtitleOverlay.CEA608_NUM_ROWS;
                var fontSize100Percent = rowHeight * (1 - windowMarginRatio) * fontSize100PercentRatio;
                fontSize = fontSize100Percent * _this.cea608FontSizeFactor;
                // Calculate the additional letter spacing required to evenly spread the text across the grid's width
                var gridSlotWidth = subtitleOverlayWidth / SubtitleOverlay.CEA608_NUM_COLUMNS;
                var fontCharWidth = fontSize * fontSizeRatio;
                fontLetterSpacing = Math.max(gridSlotWidth - fontCharWidth, 0);
            }
            else {
                // When the available space is not wide enough, texts would vertically overlap if we take
                // the height as a base for the font size, so we need to limit the height. We do that
                // by determining the font size by the width of the available space.
                rowHeight = subtitleOverlayWidth / SubtitleOverlay.CEA608_NUM_COLUMNS / fontSizeRatio;
                var fontSize100Percent = rowHeight * (1 - windowMarginRatio) * fontSize100PercentRatio;
                fontSize = fontSize100Percent * _this.cea608FontSizeFactor;
                fontLetterSpacing = 0;
            }
            windowMargin = rowHeight * windowMarginRatio;
            overlayElement.get().forEach(function (el) {
                el.style.setProperty('--cea608-row-height', "".concat(rowHeight, "px"));
            });
            // Update font-size of all active subtitle labels
            var updateLabel = function (label) {
                var labelCss = {
                    'font-size': "".concat(fontSize, "px"),
                    'line-height': "".concat(rowHeight - windowMargin, "px"),
                };
                if (_this.isCea608FormattingEnabled()) {
                    labelCss['letter-spacing'] = "".concat(fontLetterSpacing, "px");
                }
                label.getDomElement().css(labelCss);
                label.regionStyle = "margin: ".concat(windowMargin / 2, "px; height: ").concat(rowHeight, "px");
            };
            for (var _i = 0, _a = _this.getComponents(); _i < _a.length; _i++) {
                var childComponent = _a[_i];
                if (childComponent instanceof SubtitleRegionContainer) {
                    childComponent.getDomElement().css({
                        margin: "".concat(windowMargin / 2, "px"),
                        height: "".concat(rowHeight, "px"),
                    });
                    childComponent.getComponents().forEach(function (l) {
                        updateLabel(l);
                    });
                }
                if (childComponent instanceof SubtitleLabel) {
                    updateLabel(childComponent);
                }
            }
        };
        player.on(player.exports.PlayerEvent.PlayerResized, function (e) {
            _this.updateCea608PushupFromPlayerHeight(parseFloat(e.height));
            if (_this.cea608Enabled) {
                _this.ensureCea608GridSizeUpdated();
            }
        });
        this.preprocessLabelEventCallback.subscribe(function (event, label) {
            if (!isCea608SubtitleCue(event)) {
                // Skip all non-CEA608 cues
                return;
            }
            if (!_this.cea608Enabled) {
                _this.cea608Enabled = true;
                _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608));
                if (_this.isCea608FormattingEnabled()) {
                    _this.getDomElement().addClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608_FORMATTING));
                }
            }
            var leftOffset = event.position.column * SubtitleOverlay.CEA608_COLUMN_OFFSET + '%';
            if (leftOffset === '0%') {
                // ensure that a little of the window still shows for better readability
                leftOffset = SubtitleOverlay.DEFAULT_CAPTION_LEFT_OFFSET;
            }
            var labelCss = {
                left: leftOffset,
                'font-size': "".concat(fontSize, "px"),
                'line-height': "".concat(rowHeight - windowMargin, "px"),
            };
            if (_this.isCea608FormattingEnabled()) {
                labelCss['letter-spacing'] = "".concat(fontLetterSpacing, "px");
            }
            label.getDomElement().css(labelCss);
            label.regionStyle = "margin: ".concat(windowMargin / 2, "px; height: ").concat(rowHeight, "px");
        });
        var reset = function () {
            _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608));
            _this.getDomElement().removeClass(_this.prefixCss(SubtitleOverlay.CLASS_CEA_608_FORMATTING));
            if (_this.cea608Enabled) {
                // Reset the cache so the next CEA-608 session always runs a fresh recalculation.
                lastCeaGridRecalculation = { overlayWidth: 0, overlayHeight: 0, fontSizeFactor: 0 };
            }
            _this.cea608Enabled = false;
        };
        player.on(player.exports.PlayerEvent.CueExit, function () {
            if (!_this.subtitleManager.hasCues) {
                // Disable CEA-608 mode when all subtitles are gone (to allow correct formatting and
                // display of other types of subtitles, e.g. the formatting preview subtitle)
                reset();
            }
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, reset);
        player.on(player.exports.PlayerEvent.SubtitleEnabled, reset);
        player.on(player.exports.PlayerEvent.SubtitleDisabled, reset);
    };
    SubtitleOverlay.prototype.enablePreviewSubtitleLabel = function () {
        if (!this.subtitleManager.hasCues) {
            this.previewSubtitleActive = true;
            this.subtitleContainerManager.addLabel(this.previewSubtitle);
            this.updateComponents();
            this.show();
        }
    };
    SubtitleOverlay.prototype.removePreviewSubtitleLabel = function () {
        if (this.previewSubtitleActive) {
            this.previewSubtitleActive = false;
            this.subtitleContainerManager.removeLabel(this.previewSubtitle);
            this.updateComponents();
        }
    };
    SubtitleOverlay.prototype.isCea608FormattingEnabled = function () {
        var _a;
        return ((_a = this.config) === null || _a === void 0 ? void 0 : _a.enableCea608CaptionFormatting) !== false;
    };
    SubtitleOverlay.CLASS_CONTROLBAR_VISIBLE = 'controlbar-visible';
    SubtitleOverlay.CLASS_CEA_608 = 'cea608';
    SubtitleOverlay.CLASS_CEA608_PUSHUP_DISABLED = 'cea608-pushup-disabled';
    SubtitleOverlay.DEFAULT_CEA608_SMALL_PLAYER_HEIGHT_THRESHOLD = 360;
    SubtitleOverlay.CLASS_CEA_608_FORMATTING = 'cea608-formatting';
    SubtitleOverlay.CEA608_NUM_ROWS = 15;
    SubtitleOverlay.CEA608_NUM_COLUMNS = 32;
    SubtitleOverlay.CEA608_COLUMN_OFFSET = 100 / SubtitleOverlay.CEA608_NUM_COLUMNS;
    SubtitleOverlay.DEFAULT_CAPTION_LEFT_OFFSET = '0.5%';
    return SubtitleOverlay;
}(Container_1.Container));
exports.SubtitleOverlay = SubtitleOverlay;
var SubtitleLabel = /** @class */ (function (_super) {
    __extends(SubtitleLabel, _super);
    function SubtitleLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-subtitle-label',
        }, _this.config);
        return _this;
    }
    Object.defineProperty(SubtitleLabel.prototype, "vtt", {
        get: function () {
            return this.config.vtt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleLabel.prototype, "region", {
        get: function () {
            return this.config.region;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleLabel.prototype, "regionStyle", {
        get: function () {
            return this.config.regionStyle;
        },
        set: function (style) {
            this.config.regionStyle = style;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SubtitleLabel.prototype, "originalRowPosition", {
        get: function () {
            return this.config.originalRowPosition;
        },
        set: function (row) {
            this.config.originalRowPosition = row;
        },
        enumerable: false,
        configurable: true
    });
    return SubtitleLabel;
}(Label_1.Label));
exports.SubtitleLabel = SubtitleLabel;
var ActiveSubtitleManager = /** @class */ (function () {
    function ActiveSubtitleManager() {
        this.activeSubtitleCueMap = {};
        this.activeSubtitleCueCount = 0;
    }
    /**
     * Calculates a unique ID for a subtitle cue, which is needed to associate an CueEnter with its CueExit
     * event so we can remove the correct subtitle in CueExit when multiple subtitles are active at the same time.
     * The start time plus the text should make a unique identifier, and in the only case where a collision
     * can happen, two similar texts will be displayed at a similar time and a similar position (or without position).
     * The start time should always be known, because it is required to schedule the CueEnter event. The end time
     * must not necessarily be known and therefore cannot be used for the ID.
     * @param event
     * @return {string}
     */
    ActiveSubtitleManager.calculateId = function (event) {
        var id = event.start + '-' + event.text;
        if (event.position) {
            id += '-' + event.position.row + '-' + event.position.column;
        }
        return id;
    };
    ActiveSubtitleManager.prototype.cueEnter = function (event, label) {
        this.addCueToMap(event, label);
    };
    ActiveSubtitleManager.prototype.cueUpdate = function (event, label) {
        var labelToReplace = this.popCueFromMap(event);
        if (labelToReplace) {
            this.addCueToMap(event, label);
            return labelToReplace;
        }
        return undefined;
    };
    ActiveSubtitleManager.prototype.addCueToMap = function (event, label) {
        var id = ActiveSubtitleManager.calculateId(event);
        // Create array for id if it does not exist
        this.activeSubtitleCueMap[id] = this.activeSubtitleCueMap[id] || [];
        // Add cue
        this.activeSubtitleCueMap[id].push({ event: event, label: label });
        this.activeSubtitleCueCount++;
    };
    ActiveSubtitleManager.prototype.popCueFromMap = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCues = this.activeSubtitleCueMap[id];
        if (activeSubtitleCues && activeSubtitleCues.length > 0) {
            // Remove cue
            /* We apply the FIFO approach here and remove the oldest cue from the associated id. When there are multiple cues
             * with the same id, there is no way to know which one of the cues is to be deleted, so we just hope that FIFO
             * works fine. Theoretically it can happen that two cues with colliding ids are removed at different times, in
             * the wrong order. This rare case has yet to be observed. If it ever gets an issue, we can take the unstable
             * cue end time (which can change between CueEnter and CueExit IN CueUpdate) and use it as an
             * additional hint to try and remove the correct one of the colliding cues.
             */
            var activeSubtitleCue = activeSubtitleCues.shift();
            this.activeSubtitleCueCount--;
            return activeSubtitleCue.label;
        }
    };
    /**
     * Removes all active cues which don't enclose the given time
     * @param time the time for which subtitles should remain
     */
    ActiveSubtitleManager.prototype.clearInactiveCues = function (time) {
        var _this = this;
        var removedCues = [];
        Object.keys(this.activeSubtitleCueMap).forEach(function (key) {
            var activeCues = _this.activeSubtitleCueMap[key];
            activeCues.forEach(function (cue) {
                if (time < cue.event.start || time > cue.event.end) {
                    _this.popCueFromMap(cue.event);
                    removedCues.push(cue);
                }
            });
        });
        return removedCues;
    };
    ActiveSubtitleManager.generateImageTagText = function (imageData) {
        if (!imageData) {
            return;
        }
        var imgTag = new DOM_1.DOM('img', {
            src: imageData,
        });
        imgTag.css('width', '100%');
        return imgTag.get(0).outerHTML; // return the html as string
    };
    /**
     * Returns the label associated with an already added cue.
     * @param event
     * @return {SubtitleLabel}
     */
    ActiveSubtitleManager.prototype.getCues = function (event) {
        var id = ActiveSubtitleManager.calculateId(event);
        var activeSubtitleCues = this.activeSubtitleCueMap[id];
        if (activeSubtitleCues && activeSubtitleCues.length > 0) {
            return activeSubtitleCues.map(function (cue) { return cue.label; });
        }
    };
    /**
     * Removes the subtitle cue from the manager and returns the label that should be removed from the subtitle overlay,
     * or null if there is no associated label existing (e.g. because all labels have been {@link #clear cleared}.
     * @param event
     * @return {SubtitleLabel|null}
     */
    ActiveSubtitleManager.prototype.cueExit = function (event) {
        return this.popCueFromMap(event);
    };
    Object.defineProperty(ActiveSubtitleManager.prototype, "cueCount", {
        /**
         * Returns the number of active subtitle cues.
         * @return {number}
         */
        get: function () {
            // We explicitly count the cues to save an Array.reduce on every cueCount call (which can happen frequently)
            return this.activeSubtitleCueCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActiveSubtitleManager.prototype, "hasCues", {
        /**
         * Returns true if there are active subtitle cues, else false.
         * @return {boolean}
         */
        get: function () {
            return this.cueCount > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Removes all subtitle cues from the manager.
     */
    ActiveSubtitleManager.prototype.clear = function () {
        this.activeSubtitleCueMap = {};
        this.activeSubtitleCueCount = 0;
    };
    return ActiveSubtitleManager;
}());
var SubtitleRegionContainerManager = /** @class */ (function () {
    /**
     * @param subtitleOverlay Reference to the subtitle overlay for adding and removing the containers.
     */
    function SubtitleRegionContainerManager(subtitleOverlay) {
        this.subtitleOverlay = subtitleOverlay;
        this.subtitleRegionContainers = {};
        this.subtitleOverlay = subtitleOverlay;
    }
    SubtitleRegionContainerManager.prototype.getRegion = function (label) {
        if (label.vtt) {
            return {
                regionContainerId: label.vtt.region && label.vtt.region.id ? label.vtt.region.id : 'vtt',
                regionName: 'vtt',
            };
        }
        return {
            regionContainerId: label.region || 'default',
            regionName: label.region || 'default',
        };
    };
    /**
     * Creates and wraps a subtitle label into a container div based on the subtitle region.
     * If the subtitle has positioning information it is added to the container.
     * @param label The subtitle label to wrap
     */
    SubtitleRegionContainerManager.prototype.addLabel = function (label, overlaySize) {
        var _a = this.getRegion(label), regionContainerId = _a.regionContainerId, regionName = _a.regionName;
        var cssClasses = ["subtitle-position-".concat(regionName)];
        if (label.vtt && label.vtt.region) {
            cssClasses.push('subtitle-vtt-region-container');
            cssClasses.push("vtt-region-".concat(label.vtt.region.id));
        }
        else if (label.vtt) {
            cssClasses.push('subtitle-vtt-cue-container');
        }
        if (!this.subtitleRegionContainers[regionContainerId]) {
            var regionContainer = new SubtitleRegionContainer({
                cssClasses: cssClasses,
            });
            this.subtitleRegionContainers[regionContainerId] = regionContainer;
            if (label.regionStyle) {
                regionContainer.getDomElement().attr('style', label.regionStyle);
            }
            if (label.vtt) {
                regionContainer.getDomElement().css('position', 'static');
            }
            // getDomElement needs to be called at least once to ensure the component exists
            regionContainer.getDomElement();
            for (var regionContainerId_1 in this.subtitleRegionContainers) {
                this.subtitleOverlay.addComponent(this.subtitleRegionContainers[regionContainerId_1]);
            }
        }
        this.subtitleRegionContainers[regionContainerId].addLabel(label, overlaySize);
    };
    SubtitleRegionContainerManager.prototype.replaceLabel = function (previousLabel, newLabel, overlaySize) {
        var previousRegion = this.getRegion(previousLabel);
        var newRegion = this.getRegion(newLabel);
        if (previousRegion.regionContainerId === newRegion.regionContainerId) {
            var regionContainer = this.subtitleRegionContainers[previousRegion.regionContainerId];
            regionContainer.removeLabel(previousLabel);
            regionContainer.addLabel(newLabel, overlaySize);
            return;
        }
        this.removeLabel(previousLabel);
        this.addLabel(newLabel, overlaySize);
    };
    /**
     * Removes a subtitle label from a container.
     */
    SubtitleRegionContainerManager.prototype.removeLabel = function (label) {
        var regionContainerId;
        if (label.vtt) {
            regionContainerId = label.vtt.region && label.vtt.region.id ? label.vtt.region.id : 'vtt';
        }
        else {
            regionContainerId = label.region || 'default';
        }
        this.subtitleRegionContainers[regionContainerId].removeLabel(label);
        // Remove container if no more labels are displayed
        if (this.subtitleRegionContainers[regionContainerId].isEmpty()) {
            this.subtitleOverlay.removeComponent(this.subtitleRegionContainers[regionContainerId]);
            delete this.subtitleRegionContainers[regionContainerId];
        }
    };
    /**
     * Removes all subtitle containers.
     */
    SubtitleRegionContainerManager.prototype.clear = function () {
        for (var regionName in this.subtitleRegionContainers) {
            this.subtitleOverlay.removeComponent(this.subtitleRegionContainers[regionName]);
        }
        this.subtitleRegionContainers = {};
    };
    return SubtitleRegionContainerManager;
}());
exports.SubtitleRegionContainerManager = SubtitleRegionContainerManager;
var SubtitleRegionContainer = /** @class */ (function (_super) {
    __extends(SubtitleRegionContainer, _super);
    function SubtitleRegionContainer(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.labelCount = 0;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'subtitle-region-container',
        }, _this.config);
        return _this;
    }
    SubtitleRegionContainer.prototype.addLabel = function (labelToAdd, overlaySize) {
        this.labelCount++;
        if (labelToAdd.vtt) {
            if (labelToAdd.vtt.region && overlaySize) {
                VttUtils_1.VttUtils.setVttRegionStyles(this, labelToAdd.vtt.region, overlaySize);
            }
            VttUtils_1.VttUtils.setVttCueBoxStyles(labelToAdd, overlaySize);
        }
        this.addComponent(labelToAdd);
        this.updateComponents();
    };
    SubtitleRegionContainer.prototype.removeLabel = function (labelToRemove) {
        this.labelCount--;
        this.removeComponent(labelToRemove);
        this.updateComponents();
    };
    SubtitleRegionContainer.prototype.isEmpty = function () {
        return this.labelCount === 0;
    };
    return SubtitleRegionContainer;
}(Container_1.Container));
exports.SubtitleRegionContainer = SubtitleRegionContainer;
function isCea608SubtitleCue(cue) {
    return cue.position != null;
}
function awaitTransitionEnd(domElement) {
    var hasTransition = getComputedStyle(domElement.get(0)).transitionProperty !== 'none';
    if (!hasTransition) {
        return Promise.resolve();
    }
    return new Promise(function (resolve) {
        var transitionHandler = function () {
            domElement.off('transitionend', transitionHandler);
            domElement.off('transitioncancel', transitionHandler);
            resolve();
        };
        domElement.on('transitionend', transitionHandler);
        domElement.on('transitioncancel', transitionHandler);
    });
}
