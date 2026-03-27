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
exports.BufferingOverlay = void 0;
var Container_1 = require("../Container");
var Component_1 = require("../Component");
var Timeout_1 = require("../../utils/Timeout");
/**
 * Overlays the player and displays a buffering indicator.
 *
 * @category Components
 */
var BufferingOverlay = /** @class */ (function (_super) {
    __extends(BufferingOverlay, _super);
    function BufferingOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.indicators = [
            new Component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
            new Component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
            new Component_1.Component({ tag: 'div', cssClass: 'ui-buffering-overlay-indicator', role: 'img' }),
        ];
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-buffering-overlay',
            hidden: true,
            components: _this.indicators,
            showDelayMs: 1000,
        }, _this.config);
        return _this;
    }
    BufferingOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var overlayShowTimeout = new Timeout_1.Timeout(config.showDelayMs, function () {
            uimanager.onBufferingShow.dispatch(_this);
            _this.show();
        });
        var showOverlay = function () {
            overlayShowTimeout.start();
        };
        // Only show overlay if player is playing, otherwise e.g. when doing paused seeks, the overlay should stay hidden
        var showOverlayIfPlaying = function () {
            if (player.isPlaying()) {
                showOverlay();
            }
        };
        var hideOverlay = function () {
            overlayShowTimeout.clear();
            uimanager.onBufferingHide.dispatch(_this);
            _this.hide();
        };
        player.on(player.exports.PlayerEvent.StallStarted, showOverlay);
        player.on(player.exports.PlayerEvent.StallEnded, hideOverlay);
        player.on(player.exports.PlayerEvent.Play, showOverlay);
        player.on(player.exports.PlayerEvent.Playing, hideOverlay);
        player.on(player.exports.PlayerEvent.Paused, hideOverlay);
        player.on(player.exports.PlayerEvent.Seek, showOverlayIfPlaying);
        player.on(player.exports.PlayerEvent.Seeked, hideOverlay);
        player.on(player.exports.PlayerEvent.TimeShift, showOverlayIfPlaying);
        player.on(player.exports.PlayerEvent.TimeShifted, hideOverlay);
        player.on(player.exports.PlayerEvent.SourceUnloaded, hideOverlay);
        // Show overlay if player is already stalled at init
        if (player.isStalled()) {
            this.show();
        }
    };
    return BufferingOverlay;
}(Container_1.Container));
exports.BufferingOverlay = BufferingOverlay;
