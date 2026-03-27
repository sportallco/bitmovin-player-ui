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
exports.DismissClickOverlay = void 0;
var Container_1 = require("../Container");
var SettingsPanel_1 = require("../settings/SettingsPanel");
var DismissClickOverlay = /** @class */ (function (_super) {
    __extends(DismissClickOverlay, _super);
    function DismissClickOverlay(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-dismiss-click-overlay',
            role: _this.config.role,
        }, _this.config);
        return _this;
    }
    DismissClickOverlay.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        this.config.target.onShow.subscribe(function () {
            _this.show();
        });
        this.config.target.onHide.subscribe(function () {
            _this.hide();
        });
        var element = this.getDomElement();
        element.on('click', function () {
            if (_this.config.target instanceof SettingsPanel_1.SettingsPanel) {
                _this.config.target.hideAndReset();
            }
            else {
                _this.config.target.hide();
            }
        });
    };
    return DismissClickOverlay;
}(Container_1.Container));
exports.DismissClickOverlay = DismissClickOverlay;
