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
exports.VRToggleButton = void 0;
var ToggleButton_1 = require("./ToggleButton");
var i18n_1 = require("../../localization/i18n");
/**
 * A button that toggles the video view between normal/mono and VR/stereo.
 *
 * @category Buttons
 */
var VRToggleButton = /** @class */ (function (_super) {
    __extends(VRToggleButton, _super);
    function VRToggleButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-vrtogglebutton',
            text: i18n_1.i18n.getLocalizer('vr'),
        }, _this.config);
        return _this;
    }
    VRToggleButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var isVRConfigured = function () {
            // VR availability cannot be checked through getVRStatus() because it is asynchronously populated and not
            // available at UI initialization. As an alternative, we check the VR settings in the config.
            // TODO use getVRStatus() through isVRStereoAvailable() once the player has been rewritten and the status is
            // available in Ready
            var source = player.getSource();
            return source && Boolean(source.vr);
        };
        var isVRStereoAvailable = function () {
            var source = player.getSource();
            return player.vr && Boolean(source.vr);
        };
        var vrStateHandler = function (ev) {
            if (ev.type === player.exports.PlayerEvent.Warning &&
                ev.code !== player.exports.WarningCode.VR_RENDERING_ERROR) {
                return;
            }
            if (isVRConfigured() && isVRStereoAvailable()) {
                _this.show(); // show button in case it is hidden
                if (player.vr && player.vr.getStereo()) {
                    _this.on();
                }
                else {
                    _this.off();
                }
            }
            else {
                _this.hide(); // hide button if no stereo mode available
            }
        };
        var vrButtonVisibilityHandler = function () {
            if (isVRConfigured()) {
                _this.show();
            }
            else {
                _this.hide();
            }
        };
        player.on(player.exports.PlayerEvent.VRStereoChanged, vrStateHandler);
        player.on(player.exports.PlayerEvent.Warning, vrStateHandler);
        // Hide button when VR source goes away
        player.on(player.exports.PlayerEvent.SourceUnloaded, vrButtonVisibilityHandler);
        uimanager.getConfig().events.onUpdated.subscribe(vrButtonVisibilityHandler);
        this.onClick.subscribe(function () {
            if (!isVRStereoAvailable()) {
                if (console) {
                    console.log('No VR content');
                }
            }
            else {
                if (player.vr && player.vr.getStereo()) {
                    player.vr.setStereo(false);
                }
                else {
                    player.vr.setStereo(true);
                }
            }
        });
        // Set startup visibility
        vrButtonVisibilityHandler();
    };
    return VRToggleButton;
}(ToggleButton_1.ToggleButton));
exports.VRToggleButton = VRToggleButton;
