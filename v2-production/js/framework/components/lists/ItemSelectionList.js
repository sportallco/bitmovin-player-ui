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
exports.ItemSelectionList = void 0;
var ListSelector_1 = require("./ListSelector");
var DOM_1 = require("../../DOM");
var i18n_1 = require("../../localization/i18n");
/**
 * @category Components
 */
var ItemSelectionList = /** @class */ (function (_super) {
    __extends(ItemSelectionList, _super);
    function ItemSelectionList(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            tag: 'ul',
            cssClass: 'ui-itemselectionlist',
        }, _this.config);
        return _this;
    }
    ItemSelectionList.prototype.isActive = function () {
        return this.items.length > 1;
    };
    ItemSelectionList.prototype.toDomElement = function () {
        var listElement = new DOM_1.DOM('ul', {
            id: this.config.id,
            class: this.getCssClasses(),
        }, this);
        this.listElement = listElement;
        this.updateDomItems();
        return listElement;
    };
    ItemSelectionList.prototype.updateDomItems = function (selectedValue) {
        var _this = this;
        if (selectedValue === void 0) { selectedValue = null; }
        // Delete all children
        this.listElement.empty();
        var selectedListItem = null;
        var selectItem = function (listItem) {
            listItem.addClass(_this.prefixCss(ItemSelectionList.CLASS_SELECTED));
        };
        var deselectItem = function (listItem) {
            listItem.removeClass(_this.prefixCss(ItemSelectionList.CLASS_SELECTED));
        };
        var _loop_1 = function (item) {
            var listItem = new DOM_1.DOM('li', {
                type: 'li',
                class: this_1.prefixCss('ui-selectionlistitem'),
            }).append(new DOM_1.DOM('a', {}).html(i18n_1.i18n.performLocalization(item.label)));
            if (!selectedListItem) {
                if (selectedValue == null) {
                    // If there is no pre-selected value, select the first one
                    selectedListItem = listItem;
                }
                else if (String(selectedValue) === item.key) {
                    // convert selectedValue to string to catch 'null'/null case
                    selectedListItem = listItem;
                }
            }
            // Handle list item selections
            listItem.on('click', function () {
                // Deselect the previous item (if there was a selected item)
                if (selectedListItem) {
                    deselectItem(selectedListItem);
                }
                // Select the clicked item
                selectedListItem = listItem;
                selectItem(listItem);
                // Fire the event
                _this.onItemSelectedEvent(item.key, false);
            });
            // Select default item
            if (selectedListItem) {
                selectItem(selectedListItem);
            }
            this_1.listElement.append(listItem);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            _loop_1(item);
        }
    };
    ItemSelectionList.prototype.onItemsChangedEvent = function () {
        _super.prototype.onItemsChangedEvent.call(this);
        this.updateDomItems(this.selectedItem);
    };
    ItemSelectionList.prototype.onItemSelectedEvent = function (value, updateDomItems) {
        if (updateDomItems === void 0) { updateDomItems = true; }
        _super.prototype.onItemSelectedEvent.call(this, value);
        if (updateDomItems) {
            this.updateDomItems(value);
        }
    };
    ItemSelectionList.CLASS_SELECTED = 'selected';
    return ItemSelectionList;
}(ListSelector_1.ListSelector));
exports.ItemSelectionList = ItemSelectionList;
