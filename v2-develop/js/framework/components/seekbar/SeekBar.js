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
exports.SeekBar = void 0;
var GroupPlaybackAPI_1 = require("../../utils/GroupPlaybackAPI");
var Component_1 = require("../Component");
var DOM_1 = require("../../DOM");
var EventDispatcher_1 = require("../../EventDispatcher");
var Timeout_1 = require("../../utils/Timeout");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
var StringUtils_1 = require("../../utils/StringUtils");
var SeekBarController_1 = require("../../utils/SeekBarController");
var i18n_1 = require("../../localization/i18n");
var BrowserUtils_1 = require("../../utils/BrowserUtils");
var TimelineMarkersHandler_1 = require("../../utils/TimelineMarkersHandler");
var getMinBufferLevel_1 = require("../../utils/getMinBufferLevel");
/**
 * A seek bar to seek within the player's media. It displays the current playback position, amount of buffed data, seek
 * target, and keeps status about an ongoing seek.
 *
 * The seek bar displays different 'bars':
 *  - the playback position, i.e. the position in the media at which the player current playback pointer is positioned
 *  - the buffer position, which usually is the playback position plus the time span that is already buffered ahead
 *  - the seek position, used to preview to where in the timeline a seek will jump to
 *
 *  @category Components
 */
var SeekBar = /** @class */ (function (_super) {
    __extends(SeekBar, _super);
    function SeekBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        /**
         * Buffer of the the current playback position. The position must be buffered in case the element
         * needs to be refreshed with {@link #refreshPlaybackPosition}.
         * @type {number}
         */
        _this.playbackPositionPercentage = 0;
        _this.isUserSeeking = false;
        // We need to track the current ad state manually since our mobile SDKs don't expose an API to check if an ad is active.
        _this.isAdPlaying = false;
        _this.seekBarEvents = {
            /**
             * Fired when a scrubbing seek operation is started.
             */
            onSeek: new EventDispatcher_1.EventDispatcher(),
            /**
             * Fired during a scrubbing seek to indicate that the seek preview (i.e. the video frame) should be updated.
             */
            onSeekPreview: new EventDispatcher_1.EventDispatcher(),
            /**
             * Fired when a scrubbing seek has finished or when a direct seek is issued.
             */
            onSeeked: new EventDispatcher_1.EventDispatcher(),
        };
        _this.seekWhileScrubbing = function (sender, args) {
            if (args.scrubbing) {
                _this.seek(args.position);
            }
        };
        _this.getTargetSeekPosition = function (percentage) {
            var target;
            if (_this.player.isLive()) {
                var maxTimeShift = _this.player.getMaxTimeShift();
                target = maxTimeShift - maxTimeShift * (percentage / 100);
            }
            else {
                var seekableRangeStart = PlayerUtils_1.PlayerUtils.getSeekableRangeStart(_this.player, 0);
                var relativeSeekTarget = _this.player.getDuration() * (percentage / 100);
                target = relativeSeekTarget + seekableRangeStart;
            }
            return target;
        };
        _this.seek = function (percentage) {
            var targetPlaybackPosition = _this.getTargetSeekPosition(percentage);
            if (_this.player.isLive()) {
                _this.player.timeShift(targetPlaybackPosition, 'ui');
            }
            else {
                _this.player.seek(targetPlaybackPosition, 'ui');
            }
        };
        _this.updateLabelPosition = function (pixelPosition) {
            if (!_this.uiBoundingRect) {
                _this.uiBoundingRect = _this.uiManager.getUI().getDomElement().get(0).getBoundingClientRect();
            }
            _this.label.setPositionInBounds(pixelPosition, _this.uiBoundingRect);
        };
        var keyStepIncrements = _this.config.keyStepIncrements || {
            leftRight: 1,
            upDown: 5,
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-seekbar',
            vertical: false,
            smoothPlaybackPositionUpdateIntervalMs: 50,
            keyStepIncrements: keyStepIncrements,
            ariaLabel: i18n_1.i18n.getLocalizer('seekBar'),
            tabIndex: 0,
            snappingRange: 1,
            enableSeekPreview: true,
            snappingEnabled: true,
        }, _this.config);
        _this.label = _this.config.label;
        return _this;
    }
    SeekBar.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.hasLabel()) {
            this.getLabel().initialize();
        }
    };
    SeekBar.prototype.setAriaSliderMinMax = function (min, max) {
        this.getDomElement().attr('aria-valuemin', min);
        this.getDomElement().attr('aria-valuemax', max);
    };
    SeekBar.prototype.setAriaSliderValues = function () {
        if (this.seekBarType === SeekBarController_1.SeekBarType.Live) {
            var timeshiftValue = Math.ceil(this.player.getTimeShift()).toString();
            var timeShiftText = "".concat(i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('seekBar.timeshift')), " ").concat(i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('seekBar.value')), ": ").concat(timeshiftValue);
            this.getDomElement().attr('aria-valuenow', timeshiftValue);
            this.getDomElement().attr('aria-valuetext', timeShiftText);
            if (this.config.addCurrentTimeToAriaLabel) {
                this.getDomElement().attr('aria-label', "".concat(i18n_1.i18n.performLocalization(this.config.ariaLabel), ": ").concat(timeShiftText));
            }
        }
        else if (this.seekBarType === SeekBarController_1.SeekBarType.Vod) {
            var ariaValueText = "".concat(StringUtils_1.StringUtils.secondsToText(this.player.getCurrentTime()), " ").concat(i18n_1.i18n.performLocalization(i18n_1.i18n.getLocalizer('seekBar.durationText')), " ").concat(StringUtils_1.StringUtils.secondsToText(this.player.getDuration()));
            this.getDomElement().attr('aria-valuenow', Math.floor(this.player.getCurrentTime()).toString());
            this.getDomElement().attr('aria-valuetext', ariaValueText);
            if (this.config.addCurrentTimeToAriaLabel) {
                this.getDomElement().attr('aria-label', "".concat(i18n_1.i18n.performLocalization(this.config.ariaLabel), ": ").concat(StringUtils_1.StringUtils.secondsToText(this.player.getCurrentTime())));
            }
        }
    };
    SeekBar.prototype.getPlaybackPositionPercentage = function () {
        if (this.player.isLive()) {
            return 100 - (100 / this.player.getMaxTimeShift()) * this.player.getTimeShift();
        }
        return (100 / this.player.getDuration()) * this.getRelativeCurrentTime();
    };
    SeekBar.prototype.updateBufferLevel = function (playbackPositionPercentage) {
        var bufferLoadedPercentageLevel;
        if (this.player.isLive()) {
            // Always show full buffer for live streams
            bufferLoadedPercentageLevel = 100;
        }
        else {
            bufferLoadedPercentageLevel = playbackPositionPercentage + (0, getMinBufferLevel_1.getMinBufferLevel)(this.player);
        }
        this.setBufferPosition(bufferLoadedPercentageLevel);
    };
    SeekBar.prototype.configure = function (player, uimanager, configureSeek) {
        var _this = this;
        if (configureSeek === void 0) { configureSeek = true; }
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        this.uiManager = uimanager;
        // Apply scaling transform to the backdrop bar to have all bars rendered similarly
        // (the call must be up here to be executed for the volume slider as well)
        this.setPosition(this.seekBarBackdrop, 100);
        // Add seekbar controls to the seekbar
        var seekBarController = new SeekBarController_1.SeekBarController(this.config.keyStepIncrements, player, uimanager.getConfig().volumeController);
        seekBarController.setSeekBarControls(this.getDomElement(), function () { return _this.seekBarType; });
        // The configureSeek flag can be used by subclasses to disable configuration as seek bar. E.g. the volume
        // slider is reusing this component but adds its own functionality, and does not need the seek functionality.
        // This is actually a hack, the proper solution would be for both seek bar and volume sliders to extend
        // a common base slider component and implement their functionality there.
        if (!configureSeek) {
            this.seekBarType = SeekBarController_1.SeekBarType.Volume;
            return;
        }
        var resumeSeekBarUpdates = function () {
            _this.isUiShown = true;
            if (_this.smoothPlaybackPositionUpdater && !player.isLive() && !_this.smoothPlaybackPositionUpdater.isActive()) {
                playbackPositionHandler(null, true);
                _this.smoothPlaybackPositionUpdater.start();
            }
        };
        player.on(player.exports.PlayerEvent.AdStarted, function () {
            _this.isAdPlaying = true;
            resumeSeekBarUpdates();
        });
        player.on(player.exports.PlayerEvent.AdBreakFinished, function () {
            _this.isAdPlaying = false;
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, function () {
            _this.isAdPlaying = false;
        });
        uimanager.onControlsShow.subscribe(resumeSeekBarUpdates);
        uimanager.onControlsHide.subscribe(function () {
            // Keep seekbar always active during the playback of a linear ad
            if (_this.isAdPlaying) {
                return;
            }
            _this.isUiShown = false;
            if (_this.smoothPlaybackPositionUpdater && _this.smoothPlaybackPositionUpdater.isActive()) {
                _this.smoothPlaybackPositionUpdater.clear();
            }
        });
        var isPlaying = false;
        var scrubbing = false;
        var isPlayerSeeking = false;
        var suspension;
        // Update playback and buffer positions
        var playbackPositionHandler = function (event, forceUpdate) {
            if (event === void 0) { event = null; }
            if (forceUpdate === void 0) { forceUpdate = false; }
            if (_this.isUserSeeking) {
                // We caught a seek preview seek, do not update the seekbar
                return;
            }
            var playbackPositionPercentage = _this.getPlaybackPositionPercentage();
            _this.updateBufferLevel(playbackPositionPercentage);
            // The segment request finished is used to help the playback position move, when the smooth playback position is not enabled.
            // At the same time when the user is scrubbing, we also move the position of the seekbar to display a preview during scrubbing.
            // When the user is scrubbing we do not record this as a user seek operation, as the user has yet to finish their seek,
            // but we should not move the playback position to not create a jumping behaviour.
            if (scrubbing &&
                event &&
                event.type === player.exports.PlayerEvent.SegmentRequestFinished &&
                playbackPositionPercentage !== _this.playbackPositionPercentage) {
                playbackPositionPercentage = _this.playbackPositionPercentage;
            }
            if (player.isLive()) {
                if (player.getMaxTimeShift() === 0) {
                    // This case must be explicitly handled to avoid division by zero
                    _this.setPlaybackPosition(100);
                }
                else {
                    if (!_this.isSeeking()) {
                        _this.setPlaybackPosition(playbackPositionPercentage);
                    }
                    _this.setAriaSliderMinMax(player.getMaxTimeShift().toString(), '0');
                }
            }
            else {
                // Update playback position only in paused state or in the initial startup state where player is neither
                // paused nor playing. Playback updates are handled in the Timeout below.
                var isInInitialStartupState = _this.config.smoothPlaybackPositionUpdateIntervalMs === SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED ||
                    forceUpdate ||
                    player.isPaused();
                var isNeitherPausedNorPlaying = player.isPaused() === player.isPlaying();
                if ((isInInitialStartupState || isNeitherPausedNorPlaying) && !_this.isSeeking()) {
                    _this.setPlaybackPosition(playbackPositionPercentage);
                }
                _this.setAriaSliderMinMax('0', player.getDuration().toString());
            }
            if (_this.isUiShown) {
                _this.setAriaSliderValues();
            }
        };
        // Update seekbar upon these events
        // init playback position when the player is ready
        player.on(player.exports.PlayerEvent.Ready, playbackPositionHandler);
        // update playback position when it changes
        player.on(player.exports.PlayerEvent.TimeChanged, playbackPositionHandler);
        // update bufferlevel when buffering is complete
        player.on(player.exports.PlayerEvent.StallEnded, playbackPositionHandler);
        // update playback position when a timeshift has finished
        player.on(player.exports.PlayerEvent.TimeShifted, playbackPositionHandler);
        // update bufferlevel when a segment has been downloaded
        player.on(player.exports.PlayerEvent.SegmentRequestFinished, playbackPositionHandler);
        this.configureLivePausedTimeshiftUpdater(player, uimanager, playbackPositionHandler);
        // Seek handling
        var onPlayerSeek = function () {
            isPlayerSeeking = true;
            _this.setSeeking(true);
            scrubbing = false;
        };
        var onPlayerSeeked = function (event) {
            if (event === void 0) { event = null; }
            isPlayerSeeking = false;
            _this.setSeeking(false);
            // update playback position when a seek has finished
            playbackPositionHandler(event, true);
        };
        var restorePlayingState = function () {
            // Continue playback after seek if player was playing when seek started
            if (isPlaying) {
                // use the same issuer here as in the pause on seek
                player.play('ui-seek');
            }
        };
        player.on(player.exports.PlayerEvent.Seek, onPlayerSeek);
        player.on(player.exports.PlayerEvent.Seeked, onPlayerSeeked);
        player.on(player.exports.PlayerEvent.TimeShift, onPlayerSeek);
        player.on(player.exports.PlayerEvent.TimeShifted, onPlayerSeeked);
        var isGroupPlaybackAPIAvailable = function (player) {
            return !!player.groupPlayback;
        };
        this.onSeek.subscribe(function (sender) {
            // track seeking status so we can catch events from seek preview seeks
            _this.isUserSeeking = true;
            // Notify UI manager of started seek
            uimanager.onSeek.dispatch(sender);
            if (isGroupPlaybackAPIAvailable(player) && player.groupPlayback.hasJoined() && !suspension) {
                suspension = player.groupPlayback.beginSuspension(GroupPlaybackAPI_1.GroupPlaybackSuspensionReason.UserIsScrubbing);
            }
            // Save current playback state before performing the seek
            if (!isPlayerSeeking) {
                isPlaying = player.isPlaying();
                // Pause playback while seeking
                if (isPlaying) {
                    // use a different issuer here, as play/pause on seek is not "really" triggerd by the user
                    player.pause('ui-seek');
                }
            }
        });
        this.onSeekPreview.subscribe(function (sender, args) {
            // Notify UI manager of seek preview
            uimanager.onSeekPreview.dispatch(sender, args);
            scrubbing = args.scrubbing;
        });
        // Set enableSeekPreview if set in the uimanager config
        if (typeof uimanager.getConfig().enableSeekPreview === 'boolean') {
            this.config.enableSeekPreview = uimanager.getConfig().enableSeekPreview;
        }
        // Rate-limited scrubbing seek
        if (this.config.enableSeekPreview) {
            this.onSeekPreview.subscribeRateLimited(this.seekWhileScrubbing, 200);
        }
        this.onSeeked.subscribe(function (sender, percentage) {
            _this.isUserSeeking = false;
            // Do the seek
            _this.seek(percentage);
            // Notify UI manager of finished seek
            uimanager.onSeeked.dispatch(sender);
            // Continue playback after seek if player was playing when seek started
            restorePlayingState();
            if (isGroupPlaybackAPIAvailable(player) && player.groupPlayback.hasJoined() && suspension) {
                var proposedPlaybackTime = _this.getTargetSeekPosition(percentage);
                player.groupPlayback.endSuspension(suspension, { proposedPlaybackTime: proposedPlaybackTime });
                suspension = undefined;
            }
        });
        if (this.hasLabel()) {
            // Configure a seekbar label that is internal to the seekbar)
            this.getLabel().configure(player, uimanager);
        }
        // Hide seekbar for live sources without timeshift
        var isLive = false;
        var hasTimeShift = false;
        var switchVisibility = function (isLive, hasTimeShift) {
            if (isLive && !hasTimeShift) {
                _this.hide();
            }
            else {
                _this.show();
            }
            playbackPositionHandler(null, true);
            _this.refreshPlaybackPosition();
        };
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            isLive = args.live;
            if (isLive && _this.smoothPlaybackPositionUpdater != null) {
                _this.smoothPlaybackPositionUpdater.clear();
                _this.seekBarType = SeekBarController_1.SeekBarType.Live;
            }
            else {
                _this.seekBarType = SeekBarController_1.SeekBarType.Vod;
            }
            switchVisibility(isLive, hasTimeShift);
        });
        var timeShiftDetector = new PlayerUtils_1.PlayerUtils.TimeShiftAvailabilityDetector(player);
        timeShiftDetector.onTimeShiftAvailabilityChanged.subscribe(function (sender, args) {
            hasTimeShift = args.timeShiftAvailable;
            switchVisibility(isLive, hasTimeShift);
        });
        // Initial detection
        liveStreamDetector.detect();
        timeShiftDetector.detect();
        // Refresh the playback position when the player resized or the UI is configured. The playback position marker
        // is positioned absolutely and must therefore be updated when the size of the seekbar changes.
        player.on(player.exports.PlayerEvent.PlayerResized, function () {
            _this.refreshPlaybackPosition();
            _this.uiBoundingRect = _this.uiManager.getUI().getDomElement().get(0).getBoundingClientRect();
        });
        // Additionally, when this code is called, the seekbar is not part of the UI yet and therefore does not have a size,
        // resulting in a wrong initial position of the marker. Refreshing it once the UI is configured solved this issue.
        uimanager.onConfigured.subscribe(function () {
            _this.refreshPlaybackPosition();
        });
        // It can also happen when a new source is loaded
        player.on(player.exports.PlayerEvent.SourceLoaded, function () {
            _this.refreshPlaybackPosition();
        });
        // Add markers when a source is loaded or update when a marker is added or removed
        uimanager.getConfig().events.onUpdated.subscribe(function () {
            playbackPositionHandler();
        });
        // Set the snappingRange if set in the uimanager config
        if (typeof uimanager.getConfig().seekbarSnappingRange === 'number') {
            this.config.snappingRange = uimanager.getConfig().seekbarSnappingRange;
        }
        if (typeof uimanager.getConfig().seekbarSnappingEnabled === 'boolean') {
            this.config.snappingEnabled = uimanager.getConfig().seekbarSnappingEnabled;
        }
        // Initialize seekbar
        playbackPositionHandler(); // Set the playback position
        this.setBufferPosition(0);
        this.setSeekPosition(0);
        if (this.config.smoothPlaybackPositionUpdateIntervalMs !== SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED) {
            this.configureSmoothPlaybackPositionUpdater(player, uimanager);
        }
        // Initialize markers
        this.initializeTimelineMarkers(player, uimanager);
    };
    SeekBar.prototype.initializeTimelineMarkers = function (player, uimanager) {
        var _this = this;
        var timelineMarkerConfig = {
            cssPrefix: this.config.cssPrefix,
            snappingRange: this.config.snappingRange,
        };
        this.timelineMarkersHandler = new TimelineMarkersHandler_1.TimelineMarkersHandler(timelineMarkerConfig, function () { return _this.seekBar.width(); }, this.seekBarMarkersContainer);
        this.timelineMarkersHandler.initialize(player, uimanager);
    };
    /**
     * Update seekbar while a live stream with DVR window is paused.
     * The playback position stays still and the position indicator visually moves towards the back.
     */
    SeekBar.prototype.configureLivePausedTimeshiftUpdater = function (player, uimanager, playbackPositionHandler) {
        var _this = this;
        // Regularly update the playback position while the timeout is active
        this.pausedTimeshiftUpdater = new Timeout_1.Timeout(1000, playbackPositionHandler, true);
        // Start updater when a live stream with timeshift window is paused
        player.on(player.exports.PlayerEvent.Paused, function () {
            if (player.isLive() && player.getMaxTimeShift() < 0) {
                _this.pausedTimeshiftUpdater.start();
            }
        });
        // Stop updater when playback continues (no matter if the updater was started before)
        player.on(player.exports.PlayerEvent.Play, function () { return _this.pausedTimeshiftUpdater.clear(); });
    };
    SeekBar.prototype.configureSmoothPlaybackPositionUpdater = function (player, uimanager) {
        var _this = this;
        /*
         * Playback position update
         *
         * We do not update the position directly from the TimeChanged event, because it arrives very jittery and
         * results in a jittery position indicator since the CSS transition time is statically set.
         * To work around this issue, we maintain a local playback position that is updated in a stable regular interval
         * and kept in sync with the player.
         */
        var currentTimeSeekBar = 0;
        var currentTimePlayer = 0;
        var updateIntervalMs = 50;
        var currentTimeUpdateDeltaSecs = updateIntervalMs / 1000;
        this.smoothPlaybackPositionUpdater = new Timeout_1.Timeout(updateIntervalMs, function () {
            if (_this.isSeeking()) {
                return;
            }
            try {
                // Reset the currentTimeSeekBar and set the position to 0 if the player has no duration
                if (_this.player.getDuration() === 0) {
                    _this.setPlaybackPosition(0);
                    currentTimeSeekBar = 0;
                    return;
                }
                currentTimeSeekBar += currentTimeUpdateDeltaSecs;
                currentTimePlayer = _this.getRelativeCurrentTime();
            }
            catch (error) {
                // Detect if the player has been destroyed and stop updating if so
                if (error instanceof player.exports.PlayerAPINotAvailableError) {
                    _this.smoothPlaybackPositionUpdater.clear();
                }
                // If the current time cannot be read it makes no sense to continue
                return;
            }
            // Sync currentTime of seekbar to player
            var currentTimeDelta = currentTimeSeekBar - currentTimePlayer;
            // If the delta is larger that 2 secs, directly jump the seekbar to the
            // player time instead of smoothly fast forwarding/rewinding.
            if (Math.abs(currentTimeDelta) > 2) {
                currentTimeSeekBar = currentTimePlayer;
            }
            // If currentTimeDelta is negative and below the adjustment threshold,
            // the player is ahead of the seekbar and we 'fast forward' the seekbar
            else if (currentTimeDelta <= -currentTimeUpdateDeltaSecs) {
                currentTimeSeekBar += currentTimeUpdateDeltaSecs;
            }
            // If currentTimeDelta is positive and above the adjustment threshold,
            // the player is behind the seekbar and we 'rewind' the seekbar
            else if (currentTimeDelta >= currentTimeUpdateDeltaSecs) {
                currentTimeSeekBar -= currentTimeUpdateDeltaSecs;
            }
            var playbackPositionPercentage = (100 / player.getDuration()) * currentTimeSeekBar;
            _this.setPlaybackPosition(playbackPositionPercentage);
        }, true);
        var startSmoothPlaybackPositionUpdater = function () {
            if (!player.isLive()) {
                currentTimeSeekBar = _this.getRelativeCurrentTime();
                _this.smoothPlaybackPositionUpdater.start();
            }
        };
        var stopSmoothPlaybackPositionUpdater = function () {
            _this.smoothPlaybackPositionUpdater.clear();
        };
        player.on(player.exports.PlayerEvent.Play, startSmoothPlaybackPositionUpdater);
        player.on(player.exports.PlayerEvent.Playing, startSmoothPlaybackPositionUpdater);
        player.on(player.exports.PlayerEvent.Paused, stopSmoothPlaybackPositionUpdater);
        player.on(player.exports.PlayerEvent.PlaybackFinished, stopSmoothPlaybackPositionUpdater);
        player.on(player.exports.PlayerEvent.Seeked, function () {
            currentTimeSeekBar = _this.getRelativeCurrentTime();
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, stopSmoothPlaybackPositionUpdater);
        if (player.isPlaying()) {
            startSmoothPlaybackPositionUpdater();
        }
    };
    SeekBar.prototype.getRelativeCurrentTime = function () {
        return PlayerUtils_1.PlayerUtils.getCurrentTimeRelativeToSeekableRange(this.player);
    };
    SeekBar.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.smoothPlaybackPositionUpdater) {
            // object must not necessarily exist, e.g. in volume slider subclass
            this.smoothPlaybackPositionUpdater.clear();
        }
        if (this.pausedTimeshiftUpdater) {
            this.pausedTimeshiftUpdater.clear();
        }
        if (this.config.enableSeekPreview) {
            this.onSeekPreview.unsubscribe(this.seekWhileScrubbing);
        }
    };
    SeekBar.prototype.toDomElement = function () {
        var _this = this;
        if (this.config.vertical) {
            this.config.cssClasses.push('vertical');
        }
        var seekBarContainer = new DOM_1.DOM('div', {
            id: this.config.id,
            class: this.getCssClasses(),
            role: 'slider',
            'aria-label': i18n_1.i18n.performLocalization(this.config.ariaLabel),
            tabindex: this.config.tabIndex.toString(),
        }, this);
        var seekBar = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar'),
        });
        this.seekBar = seekBar;
        var seekBarBarsContainer = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-bars'),
        });
        // Indicator that shows the buffer fill level
        var seekBarBufferLevel = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-bufferlevel'),
        });
        this.seekBarBufferPosition = seekBarBufferLevel;
        // Indicator that shows the current playback position
        var seekBarPlaybackPosition = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-playbackposition'),
        });
        this.seekBarPlaybackPosition = seekBarPlaybackPosition;
        // A marker of the current playback position, e.g. a dot or line
        var seekBarPlaybackPositionMarker = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-playbackposition-marker'),
        });
        this.seekBarPlaybackPositionMarker = seekBarPlaybackPositionMarker;
        // Indicator that show where a seek will go to
        var seekBarSeekPosition = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-seekposition'),
        });
        this.seekBarSeekPosition = seekBarSeekPosition;
        // Indicator that shows the full seekbar
        var seekBarBackdrop = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-backdrop'),
        });
        this.seekBarBackdrop = seekBarBackdrop;
        var seekBarChapterMarkersContainer = new DOM_1.DOM('div', {
            class: this.prefixCss('seekbar-markers'),
        });
        this.seekBarMarkersContainer = seekBarChapterMarkersContainer;
        seekBarBarsContainer.append(this.seekBarBackdrop, this.seekBarBufferPosition, this.seekBarSeekPosition, this.seekBarPlaybackPosition);
        seekBar.append(seekBarBarsContainer, this.seekBarMarkersContainer, this.seekBarPlaybackPositionMarker);
        var seeking = false;
        // Define handler functions so we can attach/remove them later
        var mouseTouchMoveHandler = function (e) {
            e.preventDefault();
            // Avoid propagation to VR handler
            if (_this.player.vr != null) {
                e.stopPropagation();
            }
            var offset = _this.getOffset(e);
            var targetPercentage = 100 * offset;
            var seekPositionPx = offset * _this.seekBar.width();
            _this.setSeekPosition(targetPercentage);
            _this.setPlaybackPosition(targetPercentage);
            _this.onSeekPreviewEvent(targetPercentage, seekPositionPx, true);
        };
        var mouseTouchUpHandler = function (e) {
            var _a;
            e.preventDefault();
            // Remove handlers, seek operation is finished
            new DOM_1.DOM(document).off('touchmove mousemove', mouseTouchMoveHandler);
            new DOM_1.DOM(document).off('touchend mouseup', mouseTouchUpHandler);
            var targetPercentage = 100 * _this.getOffset(e);
            if (_this.config.snappingEnabled) {
                var matchingMarker = (_a = _this.timelineMarkersHandler) === null || _a === void 0 ? void 0 : _a.getMarkerAtPosition(targetPercentage);
                targetPercentage = matchingMarker ? matchingMarker.position : targetPercentage;
            }
            _this.setSeeking(false);
            seeking = false;
            // Update the UI in case we only have a click or touch
            _this.setSeekPosition(targetPercentage);
            _this.setPlaybackPosition(targetPercentage);
            // Fire seeked event
            _this.onSeekedEvent(targetPercentage);
        };
        // A seek always start with a touchstart or mousedown directly on the seekbar.
        // To track a mouse seek also outside the seekbar (for touch events this works automatically),
        // so the user does not need to take care that the mouse always stays on the seekbar, we attach the mousemove
        // and mouseup handlers to the whole document. A seek is triggered when the user lifts the mouse key.
        // A seek mouse gesture is thus basically a click with a long time frame between down and up events.
        seekBar.on('touchstart mousedown', function (e) {
            var isTouchEvent = BrowserUtils_1.BrowserUtils.isTouchSupported && _this.isTouchEvent(e);
            // Prevent selection of DOM elements (also prevents mousedown if current event is touchstart)
            e.preventDefault();
            // Avoid propagation to VR handler
            if (_this.player.vr != null) {
                e.stopPropagation();
            }
            _this.setSeeking(true); // Set seeking class on DOM element
            seeking = true; // Set seek tracking flag
            // Fire seeked event
            _this.onSeekEvent();
            // Add handler to track the seek operation over the whole document
            // This enables that scrubbing doesn't require the mouse to stay inside the UI elements itself and works
            // on the whole document.
            new DOM_1.DOM(document).on(isTouchEvent ? 'touchmove' : 'mousemove', mouseTouchMoveHandler);
            new DOM_1.DOM(document).on(isTouchEvent ? 'touchend' : 'mouseup', mouseTouchUpHandler);
        });
        // Display seek target indicator when mouse hovers or finger slides over seekbar
        seekBar.on('touchmove mousemove', function (e) {
            e.preventDefault();
            if (seeking) {
                mouseTouchMoveHandler(e);
            }
            var offset = _this.getOffset(e);
            var seekPositionPercentage = 100 * offset;
            var seekPositionPx = offset * _this.seekBar.width();
            _this.setSeekPosition(seekPositionPercentage);
            _this.onSeekPreviewEvent(seekPositionPercentage, seekPositionPx, false);
            if (_this.hasLabel() && _this.getLabel().isHidden()) {
                _this.getLabel().show();
            }
        });
        // Hide seek target indicator when mouse or finger leaves seekbar
        seekBar.on('touchend mouseleave', function (e) {
            e.preventDefault();
            _this.setSeekPosition(0);
            if (_this.hasLabel()) {
                _this.getLabel().hide();
            }
        });
        seekBarContainer.append(seekBar);
        if (this.label) {
            seekBarContainer.append(this.label.getDomElement());
        }
        return seekBarContainer;
    };
    /**
     * Gets the horizontal offset of a mouse/touch event point from the left edge of the seek bar.
     * @param eventPageX the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the left edge and 1 is the right edge
     */
    SeekBar.prototype.getHorizontalOffset = function (eventPageX) {
        var elementOffsetPx = this.seekBar.offset().left;
        var widthPx = this.seekBar.width();
        var offsetPx = eventPageX - elementOffsetPx;
        var offset = (1 / widthPx) * offsetPx;
        return this.sanitizeOffset(offset);
    };
    /**
     * Gets the vertical offset of a mouse/touch event point from the bottom edge of the seek bar.
     * @param eventPageY the pageX coordinate of an event to calculate the offset from
     * @returns {number} a number in the range of [0, 1], where 0 is the bottom edge and 1 is the top edge
     */
    SeekBar.prototype.getVerticalOffset = function (eventPageY) {
        var elementOffsetPx = this.seekBar.offset().top;
        var widthPx = this.seekBar.height();
        var offsetPx = eventPageY - elementOffsetPx;
        var offset = (1 / widthPx) * offsetPx;
        return 1 - this.sanitizeOffset(offset);
    };
    /**
     * Gets the mouse or touch event offset for the current configuration (horizontal or vertical).
     * @param e the event to calculate the offset from
     * @returns {number} a number in the range of [0, 1]
     * @see #getHorizontalOffset
     * @see #getVerticalOffset
     */
    SeekBar.prototype.getOffset = function (e) {
        if (BrowserUtils_1.BrowserUtils.isTouchSupported && this.isTouchEvent(e)) {
            if (this.config.vertical) {
                return this.getVerticalOffset(e.type === 'touchend' ? e.changedTouches[0].pageY : e.touches[0].pageY);
            }
            else {
                return this.getHorizontalOffset(e.type === 'touchend' ? e.changedTouches[0].pageX : e.touches[0].pageX);
            }
        }
        else if (e instanceof MouseEvent) {
            if (this.config.vertical) {
                return this.getVerticalOffset(e.pageY);
            }
            else {
                return this.getHorizontalOffset(e.pageX);
            }
        }
        else {
            if (console) {
                console.warn('invalid event');
            }
            return 0;
        }
    };
    /**
     * Sanitizes the mouse offset to the range of [0, 1].
     *
     * When tracking the mouse outside the seek bar, the offset can be outside the desired range and this method
     * limits it to the desired range. E.g. a mouse event left of the left edge of a seek bar yields an offset below
     * zero, but to display the seek target on the seek bar, we need to limit it to zero.
     *
     * @param offset the offset to sanitize
     * @returns {number} the sanitized offset.
     */
    SeekBar.prototype.sanitizeOffset = function (offset) {
        // Since we track mouse moves over the whole document, the target can be outside the seek range,
        // and we need to limit it to the [0, 1] range.
        if (offset < 0) {
            offset = 0;
        }
        else if (offset > 1) {
            offset = 1;
        }
        return offset;
    };
    /**
     * Sets the position of the playback position indicator.
     * @param percent a number between 0 and 100 as returned by the player
     */
    SeekBar.prototype.setPlaybackPosition = function (percent) {
        this.playbackPositionPercentage = percent;
        // Set position of the bar
        this.setPosition(this.seekBarPlaybackPosition, percent);
        // Set position of the marker
        var totalSize = this.config.vertical
            ? this.seekBar.height() - this.seekBarPlaybackPositionMarker.height()
            : this.seekBar.width();
        var px = (totalSize / 100) * percent;
        if (this.config.vertical) {
            px = this.seekBar.height() - px - this.seekBarPlaybackPositionMarker.height();
        }
        var style = this.config.vertical
            ? // -ms-transform required for IE9
                // -webkit-transform required for Android 4.4 WebView
                {
                    transform: 'translateY(' + px + 'px)',
                    '-ms-transform': 'translateY(' + px + 'px)',
                    '-webkit-transform': 'translateY(' + px + 'px)',
                }
            : {
                transform: 'translateX(' + px + 'px)',
                '-ms-transform': 'translateX(' + px + 'px)',
                '-webkit-transform': 'translateX(' + px + 'px)',
            };
        this.seekBarPlaybackPositionMarker.css(style);
    };
    /**
     * Refreshes the playback position. Can be used by subclasses to refresh the position when
     * the size of the component changes.
     */
    SeekBar.prototype.refreshPlaybackPosition = function () {
        this.setPlaybackPosition(this.playbackPositionPercentage);
    };
    /**
     * Sets the position until which media is buffered.
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setBufferPosition = function (percent) {
        this.setPosition(this.seekBarBufferPosition, percent);
    };
    /**
     * Sets the position where a seek, if executed, would jump to.
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setSeekPosition = function (percent) {
        this.setPosition(this.seekBarSeekPosition, percent);
    };
    /**
     * Set the actual position (width or height) of a DOM element that represent a bar in the seek bar.
     * @param element the element to set the position for
     * @param percent a number between 0 and 100
     */
    SeekBar.prototype.setPosition = function (element, percent) {
        var scale = percent / 100;
        // When the scale is exactly 1 or very near 1 (and the browser internally rounds it to 1), browsers seem to render
        // the elements differently and the height gets slightly off, leading to mismatching heights when e.g. the buffer
        // level bar has a width of 1 and the playback position bar has a width < 1. A jittering buffer level around 1
        // leads to an even worse flickering effect.
        // Various changes in CSS styling and DOM hierarchy did not solve the issue so the workaround is to avoid a scale
        // of exactly 1.
        if (scale >= 0.99999 && scale <= 1.00001) {
            scale = 0.99999;
        }
        var style = this.config.vertical
            ? // -ms-transform required for IE9
                // -webkit-transform required for Android 4.4 WebView
                {
                    transform: 'scaleY(' + scale + ')',
                    '-ms-transform': 'scaleY(' + scale + ')',
                    '-webkit-transform': 'scaleY(' + scale + ')',
                }
            : {
                transform: 'scaleX(' + scale + ')',
                '-ms-transform': 'scaleX(' + scale + ')',
                '-webkit-transform': 'scaleX(' + scale + ')',
            };
        element.css(style);
    };
    /**
     * Puts the seek bar into or out of seeking state by adding/removing a class to the DOM element. This can be used
     * to adjust the styling while seeking.
     *
     * @param seeking should be true when entering seek state, false when exiting the seek state
     */
    SeekBar.prototype.setSeeking = function (seeking) {
        if (seeking) {
            this.getDomElement().addClass(this.prefixCss(SeekBar.CLASS_SEEKING));
        }
        else {
            this.getDomElement().removeClass(this.prefixCss(SeekBar.CLASS_SEEKING));
        }
    };
    /**
     * Checks if the seek bar is currently in the seek state.
     * @returns {boolean} true if in seek state, else false
     */
    SeekBar.prototype.isSeeking = function () {
        return this.getDomElement().hasClass(this.prefixCss(SeekBar.CLASS_SEEKING));
    };
    /**
     * Checks if the seek bar has a {@link SeekBarLabel}.
     * @returns {boolean} true if the seek bar has a label, else false
     */
    SeekBar.prototype.hasLabel = function () {
        return this.label != null;
    };
    /**
     * Gets the label of this seek bar.
     * @returns {SeekBarLabel} the label if this seek bar has a label, else null
     */
    SeekBar.prototype.getLabel = function () {
        return this.label;
    };
    SeekBar.prototype.onSeekEvent = function () {
        this.seekBarEvents.onSeek.dispatch(this);
    };
    SeekBar.prototype.clearAllThickenedMarkers = function () {
        var _a;
        (_a = this.seekBarMarkersContainer
            .find(".".concat(this.prefixCss('seekbar-marker')))) === null || _a === void 0 ? void 0 : _a.removeClass(this.prefixCss(SeekBar.CLASS_CHAPTER_HOVERED));
    };
    SeekBar.prototype.thickenMarker = function (marker) {
        if (marker === null || marker === void 0 ? void 0 : marker.element) {
            marker.element.addClass(this.prefixCss(SeekBar.CLASS_CHAPTER_HOVERED));
        }
    };
    SeekBar.prototype.onSeekPreviewEvent = function (percentage, targetOffsetPx, scrubbing) {
        var snappedMarker = this.timelineMarkersHandler && this.timelineMarkersHandler.getMarkerAtPosition(percentage);
        var seekPositionPercentage = percentage;
        if (snappedMarker) {
            if (snappedMarker.duration > 0) {
                if (percentage < snappedMarker.position) {
                    // Snap the position to the start of the interval if the seek is within the left snap margin
                    // We know that we are within a snap margin when we are outside the marker interval but still
                    // have a snappedMarker
                    seekPositionPercentage = snappedMarker.position;
                }
                else if (percentage > snappedMarker.position + snappedMarker.duration) {
                    // Snap the position to the end of the interval if the seek is within the right snap margin
                    seekPositionPercentage = snappedMarker.position + snappedMarker.duration;
                }
            }
            else {
                // Position markers always snap to their marker position
                seekPositionPercentage = snappedMarker.position;
            }
        }
        if (this.label) {
            this.updateLabelPosition(targetOffsetPx);
        }
        if (scrubbing) {
            this.clearAllThickenedMarkers();
            this.thickenMarker(snappedMarker);
        }
        this.seekBarEvents.onSeekPreview.dispatch(this, {
            scrubbing: scrubbing,
            position: seekPositionPercentage,
            marker: snappedMarker,
        });
    };
    SeekBar.prototype.onSeekedEvent = function (percentage) {
        this.clearAllThickenedMarkers();
        this.seekBarEvents.onSeeked.dispatch(this, percentage);
    };
    Object.defineProperty(SeekBar.prototype, "onSeek", {
        /**
         * Gets the event that is fired when a scrubbing seek operation is started.
         * @returns {Event<SeekBar, NoArgs>}
         */
        get: function () {
            return this.seekBarEvents.onSeek.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SeekBar.prototype, "onSeekPreview", {
        /**
         * Gets the event that is fired during a scrubbing seek (to indicate that the seek preview, i.e. the video frame,
         * should be updated), or during a normal seek preview when the seek bar is hovered (and the seek target,
         * i.e. the seek bar label, should be updated).
         * @returns {Event<SeekBar, SeekPreviewEventArgs>}
         */
        get: function () {
            return this.seekBarEvents.onSeekPreview.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SeekBar.prototype, "onSeeked", {
        /**
         * Gets the event that is fired when a scrubbing seek has finished or when a direct seek is issued.
         * @returns {Event<SeekBar, number>}
         */
        get: function () {
            return this.seekBarEvents.onSeeked.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SeekBar.prototype.onShowEvent = function () {
        _super.prototype.onShowEvent.call(this);
        // Refresh the position of the playback position when the seek bar becomes visible. To correctly set the position,
        // the DOM element must be fully initialized and have its size calculated, because the position is set as an
        // absolute value calculated from the size. This required size is not known when it is hidden.
        // For such cases, we refresh the position here in onShow because here it is guaranteed that the component knows
        // its size and can set the position correctly.
        this.refreshPlaybackPosition();
    };
    /**
     * Checks if TouchEvent is supported.
     * @returns {boolean} true if TouchEvent not undefined, else false
     */
    SeekBar.prototype.isTouchEvent = function (e) {
        return window.TouchEvent && e instanceof TouchEvent;
    };
    SeekBar.SMOOTH_PLAYBACK_POSITION_UPDATE_DISABLED = -1;
    /**
     * The CSS class that is added to the DOM element while the seek bar is in 'seeking' state.
     */
    SeekBar.CLASS_SEEKING = 'seeking';
    SeekBar.CLASS_CHAPTER_HOVERED = 'hovered';
    return SeekBar;
}(Component_1.Component));
exports.SeekBar = SeekBar;
