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
exports.AdControlBar = void 0;
var ControlBar_1 = require("../ControlBar");
var Container_1 = require("../Container");
var i18n_1 = require("../../localization/i18n");
var SeekBar_1 = require("../seekbar/SeekBar");
/**
 * Contains player control components displayed during ad playback,
 * e.g., play toggle button, seek bar, volume control, fullscreen toggle button.
 *
 * Usage: Pass one or more {@link Container} components via the `components` array.
 * - Containers containing a {@link SeekBar} (directly or nested) are always shown.
 * - Other containers are hidden/shown when controls hide.
 *
 * @example
 * ```typescript
 * new AdControlBar({
 *   components: [
 *     new Container({
 *       components: [
 *         new AdCounterLabel(),
 *         new SeekBar({ label: new SeekBarLabel() }),
 *         new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.RemainingTime }),
 *       ],
 *       cssClasses: ['ad-controlbar-top'],
 *     }),
 *     new Container({
 *       components: [
 *         new PlaybackToggleButton(),
 *         new VolumeToggleButton(),
 *         new Spacer(),
 *         new FullscreenToggleButton(),
 *       ],
 *       cssClasses: ['ad-controlbar-bottom'],
 *     }),
 *   ],
 * })
 * ```
 *
 * @category Components
 */
var AdControlBar = /** @class */ (function (_super) {
    __extends(AdControlBar, _super);
    function AdControlBar(config) {
        var _this = _super.call(this, config) || this;
        _this.containersToHide = [];
        _this.containersToKeepVisible = [];
        _this.config = _this.mergeConfig(config, {
            cssClasses: ['ad-controlbar'],
            hidden: false,
            role: 'region',
            ariaLabel: i18n_1.i18n.getLocalizer('controlBar'),
        }, _this.config);
        // Classify containers based on whether they contain SeekBar
        _this.config.components.forEach(function (component) {
            if (component instanceof Container_1.Container) {
                if (_this.containsSeekBar(component)) {
                    _this.containersToKeepVisible.push(component);
                }
                else {
                    _this.containersToHide.push(component);
                }
            }
        });
        return _this;
    }
    AdControlBar.prototype.hide = function () {
        this.containersToHide.forEach(function (container) {
            container.hide();
        });
    };
    AdControlBar.prototype.show = function () {
        __spreadArray(__spreadArray([], this.containersToHide, true), this.containersToKeepVisible, true).forEach(function (container) {
            container.show();
        });
    };
    AdControlBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        uimanager.onControlsShow.subscribe(function () {
            _this.show();
        });
        uimanager.onControlsHide.subscribe(function () {
            _this.hide();
        });
    };
    AdControlBar.prototype.containsSeekBar = function (container) {
        var components = container.getComponents();
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var component = components_1[_i];
            if (component instanceof SeekBar_1.SeekBar) {
                return true;
            }
            if (component instanceof Container_1.Container) {
                if (this.containsSeekBar(component)) {
                    return true;
                }
            }
        }
        return false;
    };
    return AdControlBar;
}(ControlBar_1.ControlBar));
exports.AdControlBar = AdControlBar;
