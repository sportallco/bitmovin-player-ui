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
exports.ReplayButton = void 0;
var Button_1 = require("./Button");
var i18n_1 = require("../../localization/i18n");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
/**
 * A button to play/replay a video.
 *
 * @category Buttons
 */
var ReplayButton = /** @class */ (function (_super) {
    __extends(ReplayButton, _super);
    function ReplayButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-replaybutton',
            text: i18n_1.i18n.getLocalizer('replay'),
            ariaLabel: i18n_1.i18n.getLocalizer('replay'),
        }, _this.config);
        return _this;
    }
    ReplayButton.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        if (player.isLive()) {
            this.hide();
        }
        var liveStreamDetector = new PlayerUtils_1.PlayerUtils.LiveStreamDetector(player, uimanager);
        liveStreamDetector.onLiveChanged.subscribe(function (sender, args) {
            if (args.live) {
                _this.hide();
            }
            else {
                _this.show();
            }
        });
        this.onClick.subscribe(function () {
            if (!player.hasEnded()) {
                player.seek(0);
                // Not calling `play` will keep the play/pause state as is
            }
            else {
                // If playback has already ended, calling `play` will automatically restart from the beginning
                player.play('ui');
            }
        });
    };
    return ReplayButton;
}(Button_1.Button));
exports.ReplayButton = ReplayButton;
