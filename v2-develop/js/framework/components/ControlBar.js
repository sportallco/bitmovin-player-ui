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
exports.ControlBar = void 0;
var Container_1 = require("./Container");
var UIUtils_1 = require("../utils/UIUtils");
var Spacer_1 = require("./Spacer");
var i18n_1 = require("../localization/i18n");
var BrowserUtils_1 = require("../utils/BrowserUtils");
var SettingsPanel_1 = require("./settings/SettingsPanel");
/**
 * A container for main player control components, e.g. play toggle button, seek bar, volume control, fullscreen toggle
 * button.
 *
 * @category Components
 */
var ControlBar = /** @class */ (function (_super) {
    __extends(ControlBar, _super);
    function ControlBar(config) {
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-controlbar',
            hidden: true,
            role: 'region',
            ariaLabel: i18n_1.i18n.getLocalizer('controlBar'),
        }, _this.config);
        return _this;
    }
    ControlBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        // Counts how many components are hovered and block hiding of the control bar
        var hoverStackCount = 0;
        var isSettingsPanelShown = false;
        // Only enabling this for platforms without touch input.
        // Enabling this for touch devices causes the UI to not disappear after hideDelay seconds,
        // because `mouseleave` event is not emitted.
        // Instead, it will stay visible until another manual interaction is performed.
        if (uimanager.getConfig().disableAutoHideWhenHovered && !BrowserUtils_1.BrowserUtils.isTouchSupported) {
            // Track hover status of child components
            UIUtils_1.UIUtils.traverseTree(this, function (component) {
                // Do not track hover status of child containers or spacers, only of 'real' controls
                if (component instanceof Container_1.Container || component instanceof Spacer_1.Spacer) {
                    return;
                }
                // Subscribe hover event and keep a count of the number of hovered children
                component.onHoverChanged.subscribe(function (_, args) {
                    if (args.hovered) {
                        hoverStackCount++;
                    }
                    else {
                        hoverStackCount--;
                    }
                });
            });
        }
        if (BrowserUtils_1.BrowserUtils.isMobile) {
            uimanager.onComponentShow.subscribe(function (component) {
                if (component instanceof SettingsPanel_1.SettingsPanel) {
                    isSettingsPanelShown = true;
                }
            });
            uimanager.onComponentHide.subscribe(function (component) {
                if (component instanceof SettingsPanel_1.SettingsPanel) {
                    isSettingsPanelShown = false;
                }
            });
        }
        uimanager.onControlsShow.subscribe(function () {
            _this.show();
        });
        uimanager.onPreviewControlsHide.subscribe(function (sender, args) {
            // Cancel the hide event if hovered child components block hiding or if the settings panel is active on mobile.
            args.cancel = args.cancel || hoverStackCount > 0 || isSettingsPanelShown;
        });
        uimanager.onControlsHide.subscribe(function () {
            _this.hide();
        });
    };
    return ControlBar;
}(Container_1.Container));
exports.ControlBar = ControlBar;
