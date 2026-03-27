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
exports.ToggleButton = void 0;
var Button_1 = require("./Button");
var EventDispatcher_1 = require("../../EventDispatcher");
/**
 * A button that can be toggled between 'on' and 'off' states.
 *
 * @category Components
 */
var ToggleButton = /** @class */ (function (_super) {
    __extends(ToggleButton, _super);
    function ToggleButton(config) {
        var _this = _super.call(this, config) || this;
        _this.toggleButtonEvents = {
            onToggle: new EventDispatcher_1.EventDispatcher(),
            onToggleOn: new EventDispatcher_1.EventDispatcher(),
            onToggleOff: new EventDispatcher_1.EventDispatcher(),
        };
        var defaultConfig = {
            cssClass: 'ui-togglebutton',
            onClass: 'on',
            offClass: 'off',
        };
        if (config.onAriaLabel) {
            config.ariaLabel = config.onAriaLabel;
        }
        _this.config = _this.mergeConfig(config, defaultConfig, _this.config);
        _this.useAriaPressedAttributeAsToggleIndicator = !_this.config.onAriaLabel || !_this.config.offAriaLabel;
        return _this;
    }
    ToggleButton.prototype.configure = function (player, uimanager) {
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        this.getDomElement().addClass(this.prefixCss(config.offClass));
        this.useAriaPressedAttributeAsToggleIndicator = !this.config.onAriaLabel || !this.config.offAriaLabel;
        if (this.useAriaPressedAttributeAsToggleIndicator) {
            /**
             * WCAG20 standard to display if a button is pressed or not. In screenreaders, this converts the button to a
             * toggle button and the button label should not change. Unfortunately, not all devices and screenreaders support
             * this attribute (e.g. Samsung Tizen TVs).
             *
             * The alternative is to not use this attribute and toggle the button
             * label instead. This option will be used if both, `onAriaLabel` and `offAriaLabel` are set.
             */
            this.setAriaAttr('pressed', 'false');
        }
        else {
            this.setAriaLabel(this.config.offAriaLabel);
        }
    };
    /**
     * Toggles the button to the 'on' state.
     */
    ToggleButton.prototype.on = function () {
        if (this.isOff()) {
            var config = this.getConfig();
            this.onState = true;
            this.getDomElement().removeClass(this.prefixCss(config.offClass));
            this.getDomElement().addClass(this.prefixCss(config.onClass));
            this.onToggleEvent();
            this.onToggleOnEvent();
            if (this.useAriaPressedAttributeAsToggleIndicator) {
                this.setAriaAttr('pressed', 'true');
            }
            else {
                this.setAriaLabel(this.config.onAriaLabel);
            }
        }
    };
    /**
     * Toggles the button to the 'off' state.
     */
    ToggleButton.prototype.off = function () {
        if (this.isOn()) {
            var config = this.getConfig();
            this.onState = false;
            this.getDomElement().removeClass(this.prefixCss(config.onClass));
            this.getDomElement().addClass(this.prefixCss(config.offClass));
            this.onToggleEvent();
            this.onToggleOffEvent();
            if (this.useAriaPressedAttributeAsToggleIndicator) {
                this.setAriaAttr('pressed', 'false');
            }
            else {
                this.setAriaLabel(this.config.offAriaLabel);
            }
        }
    };
    /**
     * Toggle the button 'on' if it is 'off', or 'off' if it is 'on'.
     */
    ToggleButton.prototype.toggle = function () {
        if (this.isOn()) {
            this.off();
        }
        else {
            this.on();
        }
    };
    /**
     * Checks if the toggle button is in the 'on' state.
     * @returns {boolean} true if button is 'on', false if 'off'
     */
    ToggleButton.prototype.isOn = function () {
        return this.onState;
    };
    /**
     * Checks if the toggle button is in the 'off' state.
     * @returns {boolean} true if button is 'off', false if 'on'
     */
    ToggleButton.prototype.isOff = function () {
        return !this.isOn();
    };
    ToggleButton.prototype.onClickEvent = function () {
        _super.prototype.onClickEvent.call(this);
        // Fire the toggle event together with the click event
        // (they are technically the same, only the semantics are different)
        this.onToggleEvent();
    };
    ToggleButton.prototype.onToggleEvent = function () {
        this.toggleButtonEvents.onToggle.dispatch(this);
    };
    ToggleButton.prototype.onToggleOnEvent = function () {
        this.toggleButtonEvents.onToggleOn.dispatch(this);
    };
    ToggleButton.prototype.onToggleOffEvent = function () {
        this.toggleButtonEvents.onToggleOff.dispatch(this);
    };
    Object.defineProperty(ToggleButton.prototype, "onToggle", {
        /**
         * Gets the event that is fired when the button is toggled.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggle.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToggleButton.prototype, "onToggleOn", {
        /**
         * Gets the event that is fired when the button is toggled 'on'.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggleOn.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToggleButton.prototype, "onToggleOff", {
        /**
         * Gets the event that is fired when the button is toggled 'off'.
         * @returns {Event<ToggleButton<Config>, NoArgs>}
         */
        get: function () {
            return this.toggleButtonEvents.onToggleOff.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    return ToggleButton;
}(Button_1.Button));
exports.ToggleButton = ToggleButton;
