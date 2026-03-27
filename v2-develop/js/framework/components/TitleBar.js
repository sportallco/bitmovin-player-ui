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
exports.TitleBar = void 0;
var Container_1 = require("./Container");
var MetadataLabel_1 = require("./labels/MetadataLabel");
var Label_1 = require("./labels/Label");
/**
 * Displays a title bar containing a label with the title of the video or other contextual messages.
 *
 * @category Components
 */
var TitleBar = /** @class */ (function (_super) {
    __extends(TitleBar, _super);
    function TitleBar(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-titlebar',
            hidden: true,
            keepHiddenWithoutMetadata: false,
            components: [
                new Container_1.Container({
                    components: [new MetadataLabel_1.MetadataLabel({ content: MetadataLabel_1.MetadataLabelContent.Title })],
                    cssClasses: ['titlebar-row'],
                }),
                new Container_1.Container({
                    components: [new MetadataLabel_1.MetadataLabel({ content: MetadataLabel_1.MetadataLabelContent.Description })],
                    cssClasses: ['titlebar-row'],
                }),
            ],
        }, _this.config);
        return _this;
    }
    TitleBar.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        var shouldBeShown = !this.isHidden();
        var hasVisibleText = true;
        var checkTextAndUpdateVisibility = function () {
            hasVisibleText = _this.hasNonEmptyComponents(_this.getComponents());
            if (_this.isShown()) {
                if (config.keepHiddenWithoutMetadata && !hasVisibleText) {
                    _this.hide();
                }
            }
            else if (shouldBeShown) {
                if (!config.keepHiddenWithoutMetadata || hasVisibleText) {
                    _this.show();
                }
            }
        };
        // Subscribe to any label-like component's text changes
        this.subscribeToTextChanges(this.getComponents(), checkTextAndUpdateVisibility);
        uimanager.onControlsShow.subscribe(function () {
            shouldBeShown = true;
            if (!config.keepHiddenWithoutMetadata || hasVisibleText) {
                _this.show();
            }
        });
        uimanager.onControlsHide.subscribe(function () {
            shouldBeShown = false;
            _this.hide();
        });
        checkTextAndUpdateVisibility();
    };
    TitleBar.prototype.hasNonEmptyComponents = function (components) {
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var component = components_1[_i];
            if (hasIsEmpty(component) && !component.isEmpty()) {
                return true;
            }
            if (component instanceof Container_1.Container) {
                if (this.hasNonEmptyComponents(component.getComponents())) {
                    return true;
                }
            }
        }
        return false;
    };
    TitleBar.prototype.subscribeToTextChanges = function (components, onChange) {
        for (var _i = 0, components_2 = components; _i < components_2.length; _i++) {
            var component = components_2[_i];
            if (component instanceof Label_1.Label) {
                component.onTextChanged.subscribe(onChange);
            }
            if (component instanceof Container_1.Container) {
                this.subscribeToTextChanges(component.getComponents(), onChange);
            }
        }
    };
    return TitleBar;
}(Container_1.Container));
exports.TitleBar = TitleBar;
function hasIsEmpty(obj) {
    return typeof obj === 'object' && obj !== null && typeof obj.isEmpty === 'function';
}
