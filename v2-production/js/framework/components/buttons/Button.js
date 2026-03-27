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
exports.Button = exports.ButtonStyle = void 0;
var Component_1 = require("../Component");
var DOM_1 = require("../../DOM");
var EventDispatcher_1 = require("../../EventDispatcher");
var i18n_1 = require("../../localization/i18n");
var Icon_1 = require("../Icon");
/**
 * Configures the style of a {@link Button} component.
 */
var ButtonStyle;
(function (ButtonStyle) {
    /**
     * Only display the button as an icon.
     */
    ButtonStyle["Icon"] = "icon";
    /**
     * Only display the button as text.
     */
    ButtonStyle["Text"] = "text";
    /**
     * Display the button with an icon and text.
     * The Icon is displayed before the text.
     */
    ButtonStyle["TextWithLeadingIcon"] = "text-icon-leading";
    /**
     * Display the button with an icon and text.
     * The Icon is displayed after the text.
     */
    ButtonStyle["TextWithTrailingIcon"] = "text-icon-trailing";
})(ButtonStyle || (exports.ButtonStyle = ButtonStyle = {}));
/**
 * A simple clickable button.
 *
 * @category Components
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(config) {
        var _this = _super.call(this, config) || this;
        _this.buttonEvents = {
            onClick: new EventDispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-button',
            role: 'button',
            tabIndex: 0,
            acceptsTouchWithUiHidden: false,
            buttonStyle: ButtonStyle.Icon,
        }, _this.config);
        return _this;
    }
    Button.prototype.onLanguageChanged = function () {
        if (typeof this.config.text === 'function') {
            this.setText(this.config.text);
        }
    };
    Button.prototype.toDomElement = function () {
        var _this = this;
        var buttonElementAttributes = {
            id: this.config.id,
            'aria-label': i18n_1.i18n.performLocalization(this.config.ariaLabel || this.config.text),
            class: this.getCssClasses(),
            type: 'button',
            tabindex: this.config.tabIndex.toString(),
        };
        if (this.config.role != null) {
            buttonElementAttributes['role'] = this.config.role;
        }
        // Create the button element with the text label
        var buttonElement = new DOM_1.DOM('button', buttonElementAttributes, this);
        var addIconElement = function () {
            var icon = new Icon_1.Icon();
            buttonElement.append(icon.getDomElement());
        };
        var addLabelElement = function () {
            buttonElement.append(new DOM_1.DOM('span', { class: _this.prefixCss('label') }).html(i18n_1.i18n.performLocalization(_this.config.text)));
        };
        switch (this.config.buttonStyle) {
            case ButtonStyle.Icon:
                addIconElement();
                break;
            case ButtonStyle.Text:
                addLabelElement();
                break;
            case ButtonStyle.TextWithLeadingIcon:
                addIconElement();
                addLabelElement();
                break;
            case ButtonStyle.TextWithTrailingIcon:
                addLabelElement();
                addIconElement();
                break;
        }
        // Listen for the click event on the button element and trigger the corresponding event on the button component
        buttonElement.on('click', function (e) {
            e.preventDefault();
            _this.onClickEvent();
        });
        buttonElement.on('touchstart', function (e) {
            _this.getDomElement().addClass(Button.CLASS_TOUCHED);
        });
        buttonElement.on('touchend', function (e) {
            _this.getDomElement().removeClass(Button.CLASS_TOUCHED);
        });
        return buttonElement;
    };
    /**
     * Sets text on the label of the button.
     * @param text the text to put into the label of the button
     */
    Button.prototype.setText = function (text) {
        this.getDomElement()
            .find('.' + this.prefixCss('label'))
            .html(i18n_1.i18n.performLocalization(text));
    };
    Button.prototype.onClickEvent = function () {
        this.buttonEvents.onClick.dispatch(this);
    };
    Object.defineProperty(Button.prototype, "onClick", {
        /**
         * Gets the event that is fired when the button is clicked.
         * @returns {Event<Button<Config>, NoArgs>}
         */
        get: function () {
            return this.buttonEvents.onClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Button.CLASS_TOUCHED = 'touched';
    return Button;
}(Component_1.Component));
exports.Button = Button;
