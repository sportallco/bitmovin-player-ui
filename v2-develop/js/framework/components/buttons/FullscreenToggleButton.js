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
exports.FullscreenToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles the player between windowed and fullscreen view.
 *
 * @category Buttons
 */
var FullscreenToggleButton = /** @class */ (function (_super) {
    __extends(FullscreenToggleButton, _super);
    function FullscreenToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-fullscreentogglebutton',
            text: i18n_1.i18n.getLocalizer('fullscreen'),
        }, _this.config);
        return _this;
    }
    FullscreenToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var isFullScreenAvailable = function () {
            return player.isViewModeAvailable(player.exports.ViewMode.Fullscreen);
        };
        var fullscreenStateHandler = function () {
            player.getViewMode() === player.exports.ViewMode.Fullscreen ? _this.on() : _this.off();
        };
        var fullscreenAvailabilityChangedHandler = function () {
            isFullScreenAvailable() ? _this.show() : _this.hide();
        };
        player.on(player.exports.PlayerEvent.ViewModeChanged, fullscreenStateHandler);
        // Available only in our native SDKs for now
        if (player.exports.PlayerEvent.ViewModeAvailabilityChanged) {
            player.on(player.exports.PlayerEvent.ViewModeAvailabilityChanged, fullscreenAvailabilityChangedHandler);
        }
        uimanager.getConfig().events.onUpdated.subscribe(fullscreenAvailabilityChangedHandler);
        this.onClick.subscribe(function () {
            if (!isFullScreenAvailable()) {
                if (console) {
                    console.log('Fullscreen unavailable');
                }
                return;
            }
            var targetViewMode = player.getViewMode() === player.exports.ViewMode.Fullscreen
                ? player.exports.ViewMode.Inline
                : player.exports.ViewMode.Fullscreen;
            player.setViewMode(targetViewMode);
        });
        // Startup init
        fullscreenAvailabilityChangedHandler();
        fullscreenStateHandler();
    };
    return FullscreenToggleButton;
}(ToggleButton_1.ToggleButton));
exports.FullscreenToggleButton = FullscreenToggleButton;
