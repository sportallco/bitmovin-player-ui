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
exports.PictureInPictureToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles Apple macOS picture-in-picture mode.
 *
 * @category Buttons
 */
var PictureInPictureToggleButton = /** @class */ (function (_super) {
    __extends(PictureInPictureToggleButton, _super);
    function PictureInPictureToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-piptogglebutton',
            text: i18n_1.i18n.getLocalizer('pictureInPicture'),
        }, _this.config);
        return _this;
    }
    PictureInPictureToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var isPictureInPictureAvailable = function () {
            return player.isViewModeAvailable(player.exports.ViewMode.PictureInPicture);
        };
        var pictureInPictureStateHandler = function () {
            player.getViewMode() === player.exports.ViewMode.PictureInPicture ? _this.on() : _this.off();
        };
        var pictureInPictureAvailabilityChangedHandler = function () {
            isPictureInPictureAvailable() ? _this.show() : _this.hide();
        };
        player.on(player.exports.PlayerEvent.ViewModeChanged, pictureInPictureStateHandler);
        // Available only in our native SDKs for now
        if (player.exports.PlayerEvent.ViewModeAvailabilityChanged) {
            player.on(player.exports.PlayerEvent.ViewModeAvailabilityChanged, pictureInPictureAvailabilityChangedHandler);
        }
        uimanager.getConfig().events.onUpdated.subscribe(pictureInPictureAvailabilityChangedHandler);
        this.onClick.subscribe(function () {
            if (!isPictureInPictureAvailable()) {
                if (console) {
                    console.log('PIP unavailable');
                }
                return;
            }
            var targetViewMode = player.getViewMode() === player.exports.ViewMode.PictureInPicture
                ? player.exports.ViewMode.Inline
                : player.exports.ViewMode.PictureInPicture;
            player.setViewMode(targetViewMode);
        });
        // Startup init
        pictureInPictureAvailabilityChangedHandler(); // Hide button if PIP not available
        pictureInPictureStateHandler();
    };
    return PictureInPictureToggleButton;
}(ToggleButton_1.ToggleButton));
exports.PictureInPictureToggleButton = PictureInPictureToggleButton;
