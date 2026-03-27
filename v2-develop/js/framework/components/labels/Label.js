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
exports.Label = exports.LabelStyle = void 0;
var Component_1 = require("../Component");
var DOM_1 = require("../../DOM");
var EventDispatcher_1 = require("../../EventDispatcher");
var i18n_1 = require("../../localization/i18n");
var Icon_1 = require("../Icon");
var LabelStyle;
(function (LabelStyle) {
    /**
     * Only display the label text.
     */
    LabelStyle["Text"] = "text";
    /**
     * Display the label with an icon and text.
     * The Icon is displayed before the text.
     */
    LabelStyle["TextWithLeadingIcon"] = "text-icon-leading";
    /**
     * Display the label with an icon and text.
     * The Icon is displayed after the text.
     */
    LabelStyle["TextWithTrailingIcon"] = "text-icon-trailing";
})(LabelStyle || (exports.LabelStyle = LabelStyle = {}));
/**
 * A text label with optional icon.
 *
 * DOM example:
 * <code>
 *     <span class='ui-label'>
 *         <span class='ui-label-text'>...some text...</span>
 *     </span>
 * </code>
 *
 * @category Components
 */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.textElement = null;
        _this.labelEvents = {
            onClick: new EventDispatcher_1.EventDispatcher(),
            onTextChanged: new EventDispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-label',
            labelStyle: LabelStyle.Text,
        }, _this.config);
        _this.text = _this.config.text;
        return _this;
    }
    Label.prototype.onLanguageChanged = function () {
        // updating the text if it's not a (localization) function can lead to
        // hardcoded default strings sometimes overwriting the actual value
        if (typeof this.config.text === 'function') {
            this.setText(this.config.text);
        }
    };
    Label.prototype.toDomElement = function () {
        var _this = this;
        var tagName = this.config.for != null ? 'label' : 'span';
        var textElement = new DOM_1.DOM('span', {
            class: this.prefixCss('ui-label-text'),
        }, this).html(i18n_1.i18n.performLocalization(this.text));
        this.textElement = textElement;
        var wrapperElement = new DOM_1.DOM(tagName, {
            id: this.config.id,
            for: this.config.for,
            class: this.getCssClasses(),
            tabindex: this.config.tabIndex.toString(),
        }, this);
        wrapperElement.append(textElement);
        wrapperElement.on('click', function () {
            _this.onClickEvent();
        });
        if (this.config.labelStyle !== LabelStyle.Text) {
            var icon = new Icon_1.Icon();
            switch (this.config.labelStyle) {
                case LabelStyle.TextWithTrailingIcon:
                    wrapperElement.append(icon.getDomElement());
                    break;
                case LabelStyle.TextWithLeadingIcon:
                    wrapperElement.prepend(icon.getDomElement());
                    break;
            }
        }
        return wrapperElement;
    };
    /**
     * Set the text on this label.
     * @param text
     */
    Label.prototype.setText = function (text) {
        var _a;
        if (text === this.text && typeof text !== 'function') {
            return;
        }
        this.text = text;
        var localizedText = i18n_1.i18n.performLocalization(text);
        (_a = this.textElement) === null || _a === void 0 ? void 0 : _a.html(i18n_1.i18n.performLocalization(text));
        this.onTextChangedEvent(localizedText);
    };
    /**
     * Gets the text on this label.
     * @return {string} The text on the label
     */
    Label.prototype.getText = function () {
        return i18n_1.i18n.performLocalization(this.text);
    };
    /**
     * Clears the text on this label.
     */
    Label.prototype.clearText = function () {
        var _a;
        (_a = this.textElement) === null || _a === void 0 ? void 0 : _a.html('');
        this.onTextChangedEvent(null);
    };
    /**
     * Tests if the label is empty and does not contain any text.
     * @return {boolean} True if the label is empty, else false
     */
    Label.prototype.isEmpty = function () {
        return !this.text;
    };
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    Label.prototype.onClickEvent = function () {
        this.labelEvents.onClick.dispatch(this);
    };
    /**
     * Fires the {@link #onClick} event.
     * Can be used by subclasses to listen to this event without subscribing an event listener by overwriting the method
     * and calling the super method.
     */
    Label.prototype.onTextChangedEvent = function (text) {
        this.labelEvents.onTextChanged.dispatch(this, text);
    };
    Object.defineProperty(Label.prototype, "onClick", {
        /**
         * Gets the event that is fired when the label is clicked.
         * @returns {Event<Label<LabelConfig>, NoArgs>}
         */
        get: function () {
            return this.labelEvents.onClick.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "onTextChanged", {
        /**
         * Gets the event that is fired when the text on the label is changed.
         * @returns {Event<Label<LabelConfig>, string>}
         */
        get: function () {
            return this.labelEvents.onTextChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return Label;
}(Component_1.Component));
exports.Label = Label;
