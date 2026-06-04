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
exports.SelectBox = void 0;
var ListSelector_1 = require("../lists/ListSelector");
var DOM_1 = require("../../DOM");
var i18n_1 = require("../../localization/i18n");
var PlayerUtils_1 = require("../../utils/PlayerUtils");
var Component_1 = require("../Component");
var DocumentDropdownClosedEvents = [
    'mousemove',
    'mouseenter',
    'mouseleave',
    'touchstart',
    'touchmove',
    'touchend',
    'pointermove',
    'click',
    'keydown',
    'keypress',
    'keyup',
    'blur',
];
var SelectDropdownClosedEvents = ['change', 'keyup', 'mouseup'];
var DropdownOpenedEvents = [
    ['click', function () { return true; }],
    ['keydown', function (event) { return [' ', 'ArrowUp', 'ArrowDown'].includes(event.key); }],
    ['mousedown', function () { return true; }],
];
var Timeout = 100;
/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class='ui-selectbox'>
 *         <option value='key'>label</option>
 *         ...
 *     </select>
 * </code>
 *
 * @category Components
 */
var SelectBox = /** @class */ (function (_super) {
    __extends(SelectBox, _super);
    function SelectBox(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.dropdownCloseListenerTimeoutId = 0;
        _this.removeDropdownCloseListeners = function () { };
        _this.removeDropdownOpenedListeners = function () { };
        _this.onChange = function () {
            var value = _this.selectElement.val();
            _this.onItemSelectedEvent(value, false);
        };
        _this.closeDropdown = function () {
            var select = _this.getSelectElement();
            if (select === undefined) {
                return;
            }
            select.blur();
        };
        _this.onPlayerStateChange = function (_, state) {
            if ([PlayerUtils_1.PlayerUtils.PlayerState.Idle, PlayerUtils_1.PlayerUtils.PlayerState.Finished].includes(state)) {
                _this.closeDropdown();
            }
        };
        _this.onDropdownOpened = function () {
            clearTimeout(_this.dropdownCloseListenerTimeoutId);
            _this.dropdownCloseListenerTimeoutId = window.setTimeout(function () { return _this.addDropdownCloseListeners(); }, Timeout);
            _this.onViewModeChangedEvent(Component_1.ViewMode.Persistent);
        };
        _this.onDropdownClosed = function () {
            clearTimeout(_this.dropdownCloseListenerTimeoutId);
            _this.removeDropdownCloseListeners();
            _this.onViewModeChangedEvent(Component_1.ViewMode.Temporary);
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-selectbox',
        }, _this.config);
        return _this;
    }
    SelectBox.prototype.toDomElement = function () {
        this.selectElement = new DOM_1.DOM('select', {
            id: this.config.id,
            class: this.getCssClasses(),
            'aria-label': i18n_1.i18n.performLocalization(this.config.ariaLabel),
        }, this);
        this.onDisabled.subscribe(this.closeDropdown);
        this.onHide.subscribe(this.closeDropdown);
        this.addDropdownOpenedListeners();
        this.updateDomItems();
        this.selectElement.on('change', this.onChange);
        return this.selectElement;
    };
    SelectBox.prototype.configure = function (player, uimanager) {
        var _a;
        _super.prototype.configure.call(this, player, uimanager);
        this.uiContainer = uimanager.getUI();
        (_a = this.uiContainer) === null || _a === void 0 ? void 0 : _a.onPlayerStateChange().subscribe(this.onPlayerStateChange);
        this.uiWrapperElement = uimanager.uiWrapperElement;
    };
    SelectBox.prototype.getSelectElement = function () {
        var _a, _b;
        return (_b = (_a = this.selectElement) === null || _a === void 0 ? void 0 : _a.get()) === null || _b === void 0 ? void 0 : _b[0];
    };
    SelectBox.prototype.updateDomItems = function (selectedValue) {
        if (selectedValue === void 0) { selectedValue = null; }
        if (this.selectElement === undefined) {
            return;
        }
        // Delete all children
        this.selectElement.empty();
        // Add updated children
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var optionElement = new DOM_1.DOM('option', {
                value: String(item.key),
            }).html(i18n_1.i18n.performLocalization(item.label));
            if (item.key === String(selectedValue)) {
                // convert selectedValue to string to catch 'null'/null case
                optionElement.attr('selected', 'selected');
            }
            this.selectElement.append(optionElement);
        }
    };
    SelectBox.prototype.onItemsChangedEvent = function () {
        _super.prototype.onItemsChangedEvent.call(this);
        this.updateDomItems(this.selectedItem);
    };
    SelectBox.prototype.onItemSelectedEvent = function (value, updateDomItems) {
        if (updateDomItems === void 0) { updateDomItems = true; }
        _super.prototype.onItemSelectedEvent.call(this, value);
        if (updateDomItems) {
            this.updateDomItems(value);
        }
    };
    SelectBox.prototype.addDropdownCloseListeners = function () {
        var _this = this;
        this.removeDropdownCloseListeners();
        clearTimeout(this.dropdownCloseListenerTimeoutId);
        DocumentDropdownClosedEvents.forEach(function (event) { return _this.uiWrapperElement.on(event, _this.onDropdownClosed, true); });
        SelectDropdownClosedEvents.forEach(function (event) { return _this.selectElement.on(event, _this.onDropdownClosed, true); });
        this.removeDropdownCloseListeners = function () {
            DocumentDropdownClosedEvents.forEach(function (event) { return _this.uiWrapperElement.off(event, _this.onDropdownClosed, true); });
            SelectDropdownClosedEvents.forEach(function (event) { return _this.selectElement.off(event, _this.onDropdownClosed, true); });
        };
    };
    SelectBox.prototype.addDropdownOpenedListeners = function () {
        var _this = this;
        var removeListenerFunctions = [];
        this.removeDropdownOpenedListeners();
        var _loop_1 = function (event_1, filter) {
            var listener = function (event) {
                if (filter(event)) {
                    _this.onDropdownOpened();
                }
            };
            removeListenerFunctions.push(function () { return _this.selectElement.off(event_1, listener, true); });
            this_1.selectElement.on(event_1, listener, true);
        };
        var this_1 = this;
        for (var _i = 0, DropdownOpenedEvents_1 = DropdownOpenedEvents; _i < DropdownOpenedEvents_1.length; _i++) {
            var _a = DropdownOpenedEvents_1[_i], event_1 = _a[0], filter = _a[1];
            _loop_1(event_1, filter);
        }
        this.removeDropdownOpenedListeners = function () {
            for (var _i = 0, removeListenerFunctions_1 = removeListenerFunctions; _i < removeListenerFunctions_1.length; _i++) {
                var remove = removeListenerFunctions_1[_i];
                remove();
            }
        };
    };
    SelectBox.prototype.release = function () {
        _super.prototype.release.call(this);
        this.removeDropdownCloseListeners();
        this.removeDropdownOpenedListeners();
        clearTimeout(this.dropdownCloseListenerTimeoutId);
    };
    return SelectBox;
}(ListSelector_1.ListSelector));
exports.SelectBox = SelectBox;
