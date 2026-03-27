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
exports.SeekBarLabel = void 0;
var Container_1 = require("../Container");
var Label_1 = require("../labels/Label");
var Component_1 = require("../Component");
var StringUtils_1 = require("../../utils/StringUtils");
var ImageLoader_1 = require("../../utils/ImageLoader");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
/**
 * A label for a {@link SeekBar} that can display the seek target time, a thumbnail, and title (e.g. chapter title).
 *
 * @category Components
 */
var SeekBarLabel = /** @class */ (function (_super) {
    __extends(SeekBarLabel, _super);
    function SeekBarLabel(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.appliedMarkerCssClasses = [];
        _this.initializeTimeFormat = function () {
            // Set time format depending on source duration
            var player = _this.player;
            if (player == null) {
                return;
            }
            _this.timeFormat =
                Math.abs(player.isLive() ? player.getMaxTimeShift() : player.getDuration()) >= 3600
                    ? StringUtils_1.StringUtils.FORMAT_HHMMSS
                    : StringUtils_1.StringUtils.FORMAT_MMSS;
            // Set initial state of title and thumbnail to handle sourceLoaded when switching to a live-stream
            _this.setTitleText(null);
            _this.setThumbnail(null);
        };
        _this.handleSeekPreview = function (sender, args) {
            if (_this.player.isLive()) {
                var maxTimeShift = _this.player.getMaxTimeShift();
                var timeShiftPreview = maxTimeShift - maxTimeShift * (args.position / 100);
                _this.setTime(timeShiftPreview);
                // In case of a live stream the player expects the time passed into the getThumbnail as a wallClockTime and not
                // as a relative timeShift value.
                var convertTimeShiftPreviewToWallClockTime = function (targetTimeShift) {
                    var currentTimeShift = _this.player.getTimeShift();
                    var currentTime = _this.player.getCurrentTime();
                    var wallClockTimeOfLiveEdge = currentTime - currentTimeShift;
                    return wallClockTimeOfLiveEdge + targetTimeShift;
                };
                var wallClockTime = convertTimeShiftPreviewToWallClockTime(timeShiftPreview);
                _this.setThumbnail(_this.player.getThumbnail(wallClockTime));
            }
            else {
                var time = _this.player.getDuration() * (args.position / 100);
                _this.setTime(time);
                var seekableRangeStart = PlayerUtils_1.PlayerUtils.getSeekableRangeStart(_this.player, 0);
                var absoluteSeekTarget = time + seekableRangeStart;
                _this.setThumbnail(_this.player.getThumbnail(absoluteSeekTarget));
            }
            if (args.marker) {
                _this.setTitleText(args.marker.marker.title);
            }
            else {
                _this.setTitleText(null);
            }
            // Remove CSS classes from previous marker
            if (_this.appliedMarkerCssClasses.length > 0) {
                _this.getDomElement().removeClass(_this.appliedMarkerCssClasses.join(' '));
                _this.appliedMarkerCssClasses = [];
            }
            // Add CSS classes of current marker
            if (args.marker) {
                var cssClasses = (args.marker.marker.cssClasses || []).map(function (cssClass) { return _this.prefixCss(cssClass); });
                _this.getDomElement().addClass(cssClasses.join(' '));
                _this.appliedMarkerCssClasses = cssClasses;
            }
        };
        _this.timeLabel = new Label_1.Label({ cssClasses: ['seekbar-label-metadata', 'seekbar-label-time'] });
        _this.titleLabel = new Label_1.Label({ cssClasses: ['seekbar-label-metadata', 'seekbar-label-title'] });
        _this.thumbnail = new Component_1.Component({ cssClasses: ['seekbar-thumbnail'], role: 'img' });
        _this.thumbnailImageLoader = new ImageLoader_1.ImageLoader();
        _this.container = new Container_1.Container({
            components: [_this.titleLabel, _this.thumbnail, _this.timeLabel],
            cssClass: 'seekbar-label-inner',
        });
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-seekbar-label',
            components: [_this.container],
            hidden: true,
        }, _this.config);
        return _this;
    }
    SeekBarLabel.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.player = player;
        this.uiManager = uimanager;
        uimanager.onSeekPreview.subscribeRateLimited(this.handleSeekPreview, 100);
        uimanager.getConfig().events.onUpdated.subscribe(this.initializeTimeFormat);
        player.on(this.player.exports.PlayerEvent.DurationChanged, this.initializeTimeFormat);
        this.initializeTimeFormat();
    };
    SeekBarLabel.prototype.setPositionInBounds = function (seekPositionPx, bounds) {
        this.getDomElement().css('left', seekPositionPx + 'px');
        // Check parent container as it has a padding that needs to be considered
        var labelBounding = this.container.getDomElement().get(0).parentElement.getBoundingClientRect();
        var preventOverflowOffset = 0;
        if (labelBounding.right > bounds.right) {
            preventOverflowOffset = labelBounding.right - bounds.right;
        }
        else if (labelBounding.left < bounds.left) {
            preventOverflowOffset = labelBounding.left - bounds.left;
        }
        if (preventOverflowOffset !== 0) {
            this.getDomElement().css('left', seekPositionPx - preventOverflowOffset + 'px');
        }
    };
    /**
     * Sets arbitrary text on the label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setText = function (text) {
        this.timeLabel.setText(text);
    };
    /**
     * Sets a time to be displayed on the label.
     * @param seconds the time in seconds to display on the label
     */
    SeekBarLabel.prototype.setTime = function (seconds) {
        this.setText(StringUtils_1.StringUtils.secondsToTime(seconds, this.timeFormat));
    };
    /**
     * Sets the text on the title label.
     * @param text the text to show on the label
     */
    SeekBarLabel.prototype.setTitleText = function (text) {
        this.titleLabel.setText(text);
        if (text == null) {
            this.titleLabel.hide();
        }
        else {
            this.titleLabel.show();
        }
    };
    /**
     * Sets or removes a thumbnail on the label.
     * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
     */
    SeekBarLabel.prototype.setThumbnail = function (thumbnail) {
        var _this = this;
        if (thumbnail === void 0) { thumbnail = null; }
        var thumbnailElement = this.thumbnail.getDomElement();
        if (thumbnail == null) {
            thumbnailElement.css({
                'background-image': null,
                display: 'none',
                width: null,
                height: null,
            });
        }
        else {
            // We use the thumbnail image loader to make sure the thumbnail is loaded and it's size is known before be can
            // calculate the CSS properties and set them on the element.
            this.thumbnailImageLoader.load(thumbnail.url, function (url, width, height) {
                // can be checked like that because x/y/w/h are either all present or none
                // https://www.w3.org/TR/media-frags/#naming-space
                if (thumbnail.x !== undefined) {
                    thumbnailElement.css(_this.thumbnailCssSprite(thumbnail, width, height));
                }
                else {
                    thumbnailElement.css(_this.thumbnailCssSingleImage(thumbnail, width, height));
                }
            });
        }
    };
    SeekBarLabel.prototype.thumbnailCssSprite = function (thumbnail, width, height) {
        var thumbnailCountX = width / thumbnail.width;
        var thumbnailCountY = height / thumbnail.height;
        var thumbnailIndexX = thumbnail.x / thumbnail.width;
        var thumbnailIndexY = thumbnail.y / thumbnail.height;
        var sizeX = 100 * thumbnailCountX;
        var sizeY = 100 * thumbnailCountY;
        var offsetX = 100 * thumbnailIndexX;
        var offsetY = 100 * thumbnailIndexY;
        var aspectRatio = (1 / thumbnail.width) * thumbnail.height;
        // The thumbnail size is set by setting the CSS 'width' and 'padding-bottom' properties. 'padding-bottom' is
        // used because it is relative to the width and can be used to set the aspect ratio of the thumbnail.
        // A default value for width is set in the stylesheet and can be overwritten from there or anywhere else.
        return {
            display: 'inherit',
            'background-image': "url(\"".concat(thumbnail.url, "\")"),
            'padding-bottom': "".concat(100 * aspectRatio, "%"),
            'background-size': "".concat(sizeX, "% ").concat(sizeY, "%"),
            'background-position': "-".concat(offsetX, "% -").concat(offsetY, "%"),
        };
    };
    SeekBarLabel.prototype.thumbnailCssSingleImage = function (thumbnail, width, height) {
        var aspectRatio = (1 / width) * height;
        return {
            display: 'inherit',
            'background-image': "url(\"".concat(thumbnail.url, "\")"),
            'padding-bottom': "".concat(100 * aspectRatio, "%"),
            'background-size': "100% 100%",
            'background-position': "0 0",
        };
    };
    SeekBarLabel.prototype.release = function () {
        _super.prototype.release.call(this);
        this.uiManager.onSeekPreview.unsubscribe(this.handleSeekPreview);
        this.player.off(this.player.exports.PlayerEvent.DurationChanged, this.initializeTimeFormat);
    };
    return SeekBarLabel;
}(Container_1.Container));
exports.SeekBarLabel = SeekBarLabel;
