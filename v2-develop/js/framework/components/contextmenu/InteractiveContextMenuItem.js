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
exports.InteractiveContextMenuItem = void 0;
var InteractiveSettingsPanelItem_1 = require("../settings/InteractiveSettingsPanelItem");
/**
 * A generic action item for use inside a {@link ContextMenu}.
 *
 * @category Components
 */
var InteractiveContextMenuItem = /** @class */ (function (_super) {
    __extends(InteractiveContextMenuItem, _super);
    function InteractiveContextMenuItem(config) {
        var _this = _super.call(this, config) || this;
        _this.contextMenu = null;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-interactive-context-menu-item',
            role: 'menuitem',
            tabIndex: 0,
            closeContextMenuOnAction: false,
            addSettingAsComponent: false,
            isSetting: false,
        }, _this.config);
        return _this;
    }
    InteractiveContextMenuItem.prototype.setContextMenu = function (contextMenu) {
        this.contextMenu = contextMenu;
    };
    InteractiveContextMenuItem.prototype.onClickEvent = function () {
        this.closeContextMenuForAction();
        _super.prototype.onClickEvent.call(this);
    };
    InteractiveContextMenuItem.prototype.closeContextMenuForAction = function () {
        var _a;
        if (this.config.closeContextMenuOnAction) {
            (_a = this.contextMenu) === null || _a === void 0 ? void 0 : _a.hide();
        }
    };
    return InteractiveContextMenuItem;
}(InteractiveSettingsPanelItem_1.InteractiveSettingsPanelItem));
exports.InteractiveContextMenuItem = InteractiveContextMenuItem;
