"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusVisibilityTracker = void 0;
var FocusVisibleCssClassName = 'bmpui-focus-visible';
var FocusVisibilityTracker = /** @class */ (function () {
    function FocusVisibilityTracker(bitmovinUiPrefix, uiWrapperElement) {
        var _this = this;
        this.bitmovinUiPrefix = bitmovinUiPrefix;
        this.lastInteractionWasKeyboard = true;
        this.onKeyDown = function (e) {
            if (e.metaKey || e.altKey || e.ctrlKey) {
                return;
            }
            _this.lastInteractionWasKeyboard = true;
        };
        this.onMouseOrPointerOrTouch = function () { return (_this.lastInteractionWasKeyboard = false); };
        this.onFocus = function (_a) {
            var element = _a.target;
            if (_this.lastInteractionWasKeyboard &&
                isHtmlElement(element) &&
                isBitmovinUi(element, _this.bitmovinUiPrefix) &&
                !element.classList.contains(FocusVisibleCssClassName)) {
                element.classList.add(FocusVisibleCssClassName);
            }
        };
        this.onBlur = function (_a) {
            var element = _a.target;
            if (isHtmlElement(element)) {
                element.classList.remove(FocusVisibleCssClassName);
            }
        };
        this.uiWrapperElement = uiWrapperElement;
        this.eventHandlerMap = {
            mousedown: this.onMouseOrPointerOrTouch,
            pointerdown: this.onMouseOrPointerOrTouch,
            touchstart: this.onMouseOrPointerOrTouch,
            keydown: this.onKeyDown,
            focus: this.onFocus,
            blur: this.onBlur,
        };
        this.registerEventListeners();
    }
    FocusVisibilityTracker.prototype.registerEventListeners = function () {
        for (var event_1 in this.eventHandlerMap) {
            this.uiWrapperElement.on(event_1, this.eventHandlerMap[event_1], true);
        }
    };
    FocusVisibilityTracker.prototype.unregisterEventListeners = function () {
        for (var event_2 in this.eventHandlerMap) {
            this.uiWrapperElement.off(event_2, this.eventHandlerMap[event_2], true);
        }
    };
    FocusVisibilityTracker.prototype.release = function () {
        this.unregisterEventListeners();
    };
    return FocusVisibilityTracker;
}());
exports.FocusVisibilityTracker = FocusVisibilityTracker;
function isBitmovinUi(element, bitmovinUiPrefix) {
    return element.id.indexOf(bitmovinUiPrefix) === 0;
}
function isHtmlElement(element) {
    return element instanceof HTMLElement && element.classList instanceof DOMTokenList;
}
