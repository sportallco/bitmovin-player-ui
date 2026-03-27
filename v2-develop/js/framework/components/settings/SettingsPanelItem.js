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
exports.SettingsPanelItem = void 0;
var Container_1 = require("../Container");
var Component_1 = require("../Component");
var EventDispatcher_1 = require("../../EventDispatcher");
var Label_1 = require("../labels/Label");
var VideoQualitySelectBox_1 = require("./VideoQualitySelectBox");
var AudioQualitySelectBox_1 = require("./AudioQualitySelectBox");
var PlaybackSpeedSelectBox_1 = require("./PlaybackSpeedSelectBox");
var ListSelector_1 = require("../lists/ListSelector");
/**
 * An item for a {@link SettingsPanelPage},
 * Containing an optional {@link Label} and a component that configures a setting.
 * If the components is a {@link SelectBox} it will handle the logic of displaying it or not
 *
 * @category Components
 */
var SettingsPanelItem = /** @class */ (function (_super) {
    __extends(SettingsPanelItem, _super);
    function SettingsPanelItem(config) {
        var _this = _super.call(this, config) || this;
        _this.settingsPanelItemEvents = {
            onActiveChanged: new EventDispatcher_1.EventDispatcher(),
        };
        _this.settingComponent = config.settingComponent;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel-item',
            role: 'menuitem',
            addSettingAsComponent: true,
            isSetting: true,
            labelStyle: Label_1.LabelStyle.Text,
        }, _this.config);
        var label = config.label;
        if (label !== null) {
            if (label instanceof Component_1.Component) {
                _this.label = label;
            }
            else {
                _this.label = new Label_1.Label({ text: label, labelStyle: config.labelStyle });
            }
            _this.addComponent(_this.label);
        }
        return _this;
    }
    SettingsPanelItem.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        if (this.settingComponent != null && this.config.addSettingAsComponent) {
            this.addComponent(this.settingComponent);
            this.updateComponents();
        }
        if (this.settingComponent instanceof ListSelector_1.ListSelector) {
            var handleConfigItemChanged = function () {
                if (!(_this.settingComponent instanceof ListSelector_1.ListSelector)) {
                    return;
                }
                // The minimum number of items that must be available for the setting to be displayed
                // By default, at least two items must be available, else a selection is not possible
                var minItemsToDisplay = 2;
                // Audio/video quality select boxes contain an additional 'auto' mode, which in combination with a single
                // available quality also does not make sense
                if ((_this.settingComponent instanceof VideoQualitySelectBox_1.VideoQualitySelectBox && _this.settingComponent.hasAutoItem()) ||
                    _this.settingComponent instanceof AudioQualitySelectBox_1.AudioQualitySelectBox) {
                    minItemsToDisplay = 3;
                }
                if (_this.settingComponent.itemCount() < minItemsToDisplay) {
                    // Hide the setting if no meaningful choice is available
                    _this.hide();
                }
                else if (_this.settingComponent instanceof PlaybackSpeedSelectBox_1.PlaybackSpeedSelectBox &&
                    !uimanager.getConfig().playbackSpeedSelectionEnabled) {
                    // Hide the PlaybackSpeedSelectBox if disabled in config
                    _this.hide();
                }
                else {
                    _this.show();
                }
                // Visibility might have changed and therefore the active state might have changed so we fire the event
                // TODO fire only when state has really changed (e.g. check if visibility has really changed)
                _this.onActiveChangedEvent();
                _this.getDomElement().attr('aria-haspopup', 'true');
            };
            this.settingComponent.onItemAdded.subscribe(handleConfigItemChanged);
            this.settingComponent.onItemRemoved.subscribe(handleConfigItemChanged);
            // Initialize hidden state
            handleConfigItemChanged();
        }
    };
    SettingsPanelItem.prototype.onLanguageChanged = function () {
        if (this.label instanceof Label_1.Label && typeof this.config.label === 'function') {
            this.label.setText(this.config.label);
        }
    };
    /**
     * Checks if this settings panel item is active, i.e. visible and enabled and a user can interact with it.
     * @returns {boolean} true if the panel is active, else false
     */
    SettingsPanelItem.prototype.isActive = function () {
        return this.isShown();
    };
    SettingsPanelItem.prototype.onActiveChangedEvent = function () {
        this.settingsPanelItemEvents.onActiveChanged.dispatch(this);
    };
    Object.defineProperty(SettingsPanelItem.prototype, "onActiveChanged", {
        /**
         * Gets the event that is fired when the 'active' state of this item changes.
         * @see #isActive
         * @returns {Event<SettingsPanelItem, NoArgs>}
         */
        get: function () {
            return this.settingsPanelItemEvents.onActiveChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return SettingsPanelItem;
}(Container_1.Container));
exports.SettingsPanelItem = SettingsPanelItem;
