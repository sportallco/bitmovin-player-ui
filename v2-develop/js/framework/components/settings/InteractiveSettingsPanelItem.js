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
exports.InteractiveSettingsPanelItem = void 0;
var SettingsPanelItem_1 = require("./SettingsPanelItem");
var EventDispatcher_1 = require("../../EventDispatcher");
var getKeyMapForPlatform_1 = require("../../spatialnavigation/getKeyMapForPlatform");
var types_1 = require("../../spatialnavigation/types");
/**
 * A settings panel item that can be interacted with using the keyboard or mouse.
 * Can be used when no interactive element is present as child item.
 */
var InteractiveSettingsPanelItem = /** @class */ (function (_super) {
    __extends(InteractiveSettingsPanelItem, _super);
    function InteractiveSettingsPanelItem(config) {
        var _this = _super.call(this, config) || this;
        _this.events = {
            onClick: new EventDispatcher_1.EventDispatcher(),
        };
        return _this;
    }
    InteractiveSettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var handleClickEvent = function (event) {
            event.preventDefault();
            event.stopPropagation();
            _this.onClickEvent();
        };
        this.getDomElement().on('click', handleClickEvent);
        // Listen to keyboard events and trigger the click event when a select key is detected
        var handleKeyDown = function (event) {
            var action = (0, getKeyMapForPlatform_1.getKeyMapForPlatform)()[event.keyCode];
            var acceptedKeys = ['Enter', ' '];
            var acceptedCodes = ['Enter', 'Space'];
            if (action === types_1.Action.SELECT || acceptedKeys.includes(event.key) || acceptedCodes.includes(event.code)) {
                handleClickEvent(event);
            }
        };
        this.onFocusedChanged.subscribe(function (_, args) {
            if (args.focused) {
                // Only listen to keyboard events when the element is focused
                _this.getDomElement().on('keydown', handleKeyDown);
            }
            else {
                // Unregister the keyboard event listener when the element loses focus
                _this.getDomElement().off('keydown', handleKeyDown);
            }
        });
    };
    InteractiveSettingsPanelItem.prototype.onClickEvent = function () {
        this.events.onClick.dispatch(this);
    };
    Object.defineProperty(InteractiveSettingsPanelItem.prototype, "onClick", {
        /**
         * Gets the event that is fired when the SettingsPanelItem is clicked.
         * @returns {Event<InteractiveSettingsPanelItem<Config>, NoArgs>}
         */
        get: function () {
            return this.events.onClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return InteractiveSettingsPanelItem;
}(SettingsPanelItem_1.SettingsPanelItem));
exports.InteractiveSettingsPanelItem = InteractiveSettingsPanelItem;
