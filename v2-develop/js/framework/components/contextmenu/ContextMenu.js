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
exports.ContextMenu = void 0;
var SettingsPanel_1 = require("../settings/SettingsPanel");
var Container_1 = require("../Container");
var InteractiveContextMenuItem_1 = require("./InteractiveContextMenuItem");
/**
 * A floating context menu shown at the pointer position when the user opens the
 * browser context menu inside the player UI.
 *
 * @category Components
 */
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-context-menu',
            hideDelay: -1,
            hideOnControlsHide: false,
            hidden: true,
            role: 'menu',
        }, _this.config);
        _this.getComponents().forEach(function (component) { return _this.setContextMenuForComponent(component); });
        return _this;
    }
    ContextMenu.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var uiContainer = uimanager.getUI();
        this.contextMenuHost = uiContainer.getDomElement().get(0);
        this.onHide.subscribe(function () {
            var contextMenuElement = _this.getDomElement();
            contextMenuElement.waitForTransitionEnd('opacity').then(function () {
                if (_this.isHidden()) {
                    contextMenuElement.remove();
                }
            });
        });
        var documentContextMenuHandler = function (event) {
            if (event.defaultPrevented) {
                return;
            }
            if (_this.isShown()) {
                if (!_this.isEventTargetInsideContextMenu(event)) {
                    _this.hideAndReset();
                }
                // Let the browser handle a second contextmenu event while the custom menu is open,
                // so users can still access native actions like Inspect Element.
                return;
            }
            if (!_this.isEventTargetInsideElement(event, uiContainer.getDomElement().get(0))) {
                return;
            }
            event.preventDefault();
            _this.showAt(event.clientX, event.clientY);
        };
        var documentKeyDownHandler = function (event) {
            if (event.key === 'Escape' && _this.isShown()) {
                _this.hideAndReset();
            }
        };
        var documentClickHandler = function (event) {
            if (_this.isShown() && !_this.isEventTargetInsideContextMenu(event)) {
                _this.hideAndReset();
            }
        };
        var attachDocumentHandlers = function () {
            document.addEventListener('contextmenu', documentContextMenuHandler);
            document.addEventListener('keydown', documentKeyDownHandler);
            document.addEventListener('click', documentClickHandler);
        };
        var detachDocumentHandlers = function () {
            document.removeEventListener('contextmenu', documentContextMenuHandler);
            document.removeEventListener('keydown', documentKeyDownHandler);
            document.removeEventListener('click', documentClickHandler);
        };
        var deactivateHandler = function () {
            detachDocumentHandlers();
            _this.hideAndReset();
        };
        uimanager.onActive.subscribe(attachDocumentHandlers);
        uimanager.onInactive.subscribe(deactivateHandler);
    };
    ContextMenu.prototype.release = function () {
        var _this = this;
        this.getComponents().forEach(function (component) { return _this.unsetContextMenuForComponent(component); });
        _super.prototype.release.call(this);
        if (this.hasDomElement()) {
            this.getDomElement().remove();
        }
    };
    ContextMenu.prototype.addComponent = function (component) {
        _super.prototype.addComponent.call(this, component);
        this.setContextMenuForComponent(component);
    };
    ContextMenu.prototype.prependComponent = function (component) {
        _super.prototype.prependComponent.call(this, component);
        this.setContextMenuForComponent(component);
    };
    ContextMenu.prototype.removeComponent = function (component) {
        var removed = _super.prototype.removeComponent.call(this, component);
        if (removed) {
            this.unsetContextMenuForComponent(component);
        }
        return removed;
    };
    ContextMenu.prototype.showAt = function (clientX, clientY) {
        var contextMenuElement = this.getDomElement();
        var contextMenuRootElement = contextMenuElement.get(0);
        this.attachContextMenuElement();
        // The element is still laid out while hidden (visibility: hidden, not display: none),
        // so offsetWidth/Height return the real dimensions.
        var offsetWidth = contextMenuRootElement.offsetWidth, offsetHeight = contextMenuRootElement.offsetHeight;
        var hostRect = this.contextMenuHost.getBoundingClientRect();
        var maxX = Math.max(0, hostRect.width - offsetWidth - 4);
        var maxY = Math.max(0, hostRect.height - offsetHeight - 4);
        var clampedX = Math.max(0, Math.min(clientX - hostRect.left, maxX));
        var clampedY = Math.max(0, Math.min(clientY - hostRect.top, maxY));
        contextMenuElement.css({
            left: "".concat(clampedX, "px"),
            top: "".concat(clampedY, "px"),
        });
        this.show();
    };
    ContextMenu.prototype.isEventTargetInsideContextMenu = function (event) {
        return this.isEventTargetInsideElement(event, this.getDomElement().get(0));
    };
    ContextMenu.prototype.isEventTargetInsideElement = function (event, element) {
        var _a;
        var eventPath = (_a = event.composedPath) === null || _a === void 0 ? void 0 : _a.call(event);
        if (eventPath) {
            return eventPath.includes(element);
        }
        return event.target instanceof Node && element.contains(event.target);
    };
    ContextMenu.prototype.attachContextMenuElement = function () {
        this.contextMenuHost.appendChild(this.getDomElement().get(0));
    };
    ContextMenu.prototype.setContextMenuForComponent = function (component) {
        var _this = this;
        if (component instanceof InteractiveContextMenuItem_1.InteractiveContextMenuItem) {
            component.setContextMenu(this);
        }
        if (component instanceof Container_1.Container) {
            component.getComponents().forEach(function (childComponent) { return _this.setContextMenuForComponent(childComponent); });
        }
    };
    ContextMenu.prototype.unsetContextMenuForComponent = function (component) {
        var _this = this;
        if (component instanceof InteractiveContextMenuItem_1.InteractiveContextMenuItem) {
            component.setContextMenu(null);
        }
        if (component instanceof Container_1.Container) {
            component.getComponents().forEach(function (childComponent) { return _this.unsetContextMenuForComponent(childComponent); });
        }
    };
    return ContextMenu;
}(SettingsPanel_1.SettingsPanel));
exports.ContextMenu = ContextMenu;
