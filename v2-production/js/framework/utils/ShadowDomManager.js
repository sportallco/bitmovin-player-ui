"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomManager = void 0;
var DOM_1 = require("../DOM");
var DummyComponent_1 = require("../components/DummyComponent");
/**
 * Encapsulates Shadow DOM initialization.
 */
var ShadowDomManager = /** @class */ (function () {
    function ShadowDomManager() {
    }
    ShadowDomManager.isShadowDomSupported = function () {
        return (typeof ShadowRoot !== 'undefined' &&
            typeof HTMLElement !== 'undefined' &&
            typeof HTMLElement.prototype.attachShadow === 'function');
    };
    ShadowDomManager.prototype.initialize = function (containerElement, shadowDomConfig) {
        if (!ShadowDomManager.isShadowDomSupported()) {
            return;
        }
        var shadowHost = new DOM_1.DOM('div', {
            class: (0, DummyComponent_1.prefixCss)('shadow-dom-container'),
        });
        shadowHost.css({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
        });
        containerElement.append(shadowHost);
        this.shadowHost = shadowHost;
        this.shadowRoot = shadowHost.get(0).attachShadow({ mode: 'open' });
        this.injectStyles(shadowDomConfig);
    };
    ShadowDomManager.prototype.getShadowRoot = function () {
        return this.shadowRoot;
    };
    ShadowDomManager.prototype.release = function () {
        if (this.shadowHost) {
            this.shadowHost.remove();
            this.shadowHost = undefined;
            this.shadowRoot = undefined;
        }
    };
    /**
     * Looks for existing stylesheets on the document for the given names and injects them into the ShadowRoot to include
     * default UI styles (and custom additional styles).
     */
    ShadowDomManager.prototype.injectStyles = function (shadowDomConfig) {
        var _this = this;
        if (!this.shadowRoot) {
            return;
        }
        var stylesheetName = shadowDomConfig.uiStylesheet || ShadowDomManager.DEFAULT_SHADOW_STYLESHEET_NAME;
        var mainHref = resolveStylesheetHref(stylesheetName);
        if (mainHref) {
            appendStylesheet(this.shadowRoot, mainHref);
        }
        else {
            console.warn('Shadow DOM is enabled but no stylesheet was found. ' +
                'Provide `uiStylesheet` (URL or filename) or include {{FILENAME}} on the page.');
        }
        // Inject additional stylesheets
        if (shadowDomConfig.additionalStylesheets && shadowDomConfig.additionalStylesheets.length > 0) {
            shadowDomConfig.additionalStylesheets.forEach(function (stylesheetName) {
                var href = resolveStylesheetHref(stylesheetName);
                if (href) {
                    appendStylesheet(_this.shadowRoot, href);
                }
                else {
                    console.warn("Shadow DOM: Could not resolve additional stylesheet '".concat(stylesheetName, "'. ") +
                        'Check the URL or ensure the stylesheet is linked on the page.');
                }
            });
        }
    };
    ShadowDomManager.DEFAULT_SHADOW_STYLESHEET_NAME = '{{FILENAME}}';
    return ShadowDomManager;
}());
exports.ShadowDomManager = ShadowDomManager;
function resolveStylesheetHref(stylesheetName) {
    var isUrl = /^https?:\/\//.test(stylesheetName) ||
        stylesheetName.startsWith('/') ||
        stylesheetName.startsWith('./') ||
        stylesheetName.startsWith('../');
    if (isUrl) {
        return stylesheetName;
    }
    // Search for filename/substring in existing stylesheets
    var stylesheetLinks = Array.from(document.querySelectorAll('link[rel~="stylesheet"]'));
    var matchingLink = stylesheetLinks.find(function (link) { return link.href && link.href.indexOf(stylesheetName) !== -1; });
    return (matchingLink === null || matchingLink === void 0 ? void 0 : matchingLink.href) || null;
}
function appendStylesheet(shadowRoot, href) {
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    shadowRoot.appendChild(linkElement);
}
