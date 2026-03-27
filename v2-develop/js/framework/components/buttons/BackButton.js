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
exports.BackButton = void 0;
var Button_1 = require("./Button");
var i18n_1 = require("../../localization/i18n");
var BackButton = /** @class */ (function (_super) {
    __extends(BackButton, _super);
    function BackButton(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-backbutton',
            text: i18n_1.i18n.getLocalizer('back'),
        }, _this.config);
        return _this;
    }
    BackButton.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        this.onClick.subscribe(function () {
            var _a;
            var customMessageHandler = (_a = window.bitmovin) === null || _a === void 0 ? void 0 : _a.customMessageHandler;
            if (customMessageHandler) {
                customMessageHandler.sendAsynchronous('goBack');
            }
        });
    };
    return BackButton;
}(Button_1.Button));
exports.BackButton = BackButton;
