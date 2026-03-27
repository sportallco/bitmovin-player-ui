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
exports.AdStatusOverlay = void 0;
var Container_1 = require("../Container");
var AdSkipButton_1 = require("./AdSkipButton");
var Spacer_1 = require("../Spacer");
/**
 * An overlay holding the AdSkipButton which is always visible during Ad playback.
 *
 * @category Components
 */
var AdStatusOverlay = /** @class */ (function (_super) {
    __extends(AdStatusOverlay, _super);
    function AdStatusOverlay(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.adSkipButton = new AdSkipButton_1.AdSkipButton();
        _this.config = _this.mergeConfig(config, {
            components: [
                new Container_1.Container({
                    components: [new Spacer_1.Spacer(), _this.adSkipButton],
                    cssClasses: ['bar'],
                }),
            ],
            cssClass: 'ui-ad-status-overlay',
        }, _this.config);
        return _this;
    }
    AdStatusOverlay.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
    };
    return AdStatusOverlay;
}(Container_1.Container));
exports.AdStatusOverlay = AdStatusOverlay;
