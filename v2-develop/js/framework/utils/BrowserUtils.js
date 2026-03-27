"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserUtils = void 0;
/**
 * @category Utils
 */
var BrowserUtils = /** @class */ (function () {
    function BrowserUtils() {
    }
    Object.defineProperty(BrowserUtils, "isMobile", {
        // isMobile only needs to be evaluated once (it cannot change during a browser session)
        // Mobile detection according to Mozilla recommendation: "In summary, we recommend looking for the string “Mobi”
        // anywhere in the User Agent to detect a mobile device."
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Mobi/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isChrome", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Chrome/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isAndroid", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Android/.test(navigator.userAgent) && !this.isHisense;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isIOS", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isMacIntel", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && navigator.platform === 'MacIntel';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isTv", {
        get: function () {
            return (this.isHisense ||
                this.isPlayStation ||
                this.isWebOs ||
                this.isTizen ||
                this.isVizio ||
                this.isXumo ||
                this.isXbox ||
                this.isVidaa);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isHisense", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Hisense/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isPlayStation", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /PlayStation/i.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isWebOs", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return (navigator &&
                navigator.userAgent &&
                (navigator.userAgent.includes('Web0S') || navigator.userAgent.includes('NetCast')));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isTizen", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Tizen/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isVizio", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /vizio/.test(navigator.userAgent.toLowerCase());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isXumo", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return ((navigator && navigator.userAgent && /sky_ott/.test(navigator.userAgent.toLowerCase())) ||
                (navigator && navigator.userAgent && /xglobal/.test(navigator.userAgent.toLowerCase())) ||
                (navigator && navigator.userAgent && /xfinity/.test(navigator.userAgent.toLowerCase())));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isXbox", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /Xbox/.test(navigator.userAgent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isVidaa", {
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return navigator && navigator.userAgent && /vidaa/.test(navigator.userAgent.toLowerCase());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BrowserUtils, "isTouchSupported", {
        // https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
        get: function () {
            if (!this.windowExists()) {
                return false;
            }
            return ('ontouchstart' in window ||
                (navigator && navigator.userAgent && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)));
        },
        enumerable: false,
        configurable: true
    });
    BrowserUtils.windowExists = function () {
        return typeof window !== 'undefined';
    };
    return BrowserUtils;
}());
exports.BrowserUtils = BrowserUtils;
