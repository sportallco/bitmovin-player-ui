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
exports.SettingsPanelSeparator = void 0;
var Container_1 = require("../Container");
/**
 * A visual separator between groups of settings panel rows.
 *
 * @category Components
 */
var SettingsPanelSeparator = /** @class */ (function (_super) {
    __extends(SettingsPanelSeparator, _super);
    function SettingsPanelSeparator(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-separator',
            role: 'separator',
        }, _this.config);
        return _this;
    }
    return SettingsPanelSeparator;
}(Container_1.Container));
exports.SettingsPanelSeparator = SettingsPanelSeparator;
