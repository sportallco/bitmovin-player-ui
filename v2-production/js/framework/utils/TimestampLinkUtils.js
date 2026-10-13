"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampLinkUtils = void 0;
var TimestampLinkUtils;
(function (TimestampLinkUtils) {
    function parseTimestampFromUrl(href) {
        var _a;
        if (href === void 0) { href = window.location.href; }
        var url = new URL(href);
        var timestamp = (_a = url.searchParams.get('t')) !== null && _a !== void 0 ? _a : new URLSearchParams(url.hash.substring(1)).get('t');
        var match = timestamp === null || timestamp === void 0 ? void 0 : timestamp.match(/^([0-9]+(?:\.[0-9]+)?)s?$/);
        if (!match) {
            return null;
        }
        var value = parseFloat(match[1]);
        return isFinite(value) && value >= 0 ? value : null;
    }
    TimestampLinkUtils.parseTimestampFromUrl = parseTimestampFromUrl;
    function buildTimestampLink(currentTime, href) {
        if (href === void 0) { href = window.location.href; }
        var url = new URL(href);
        var time = Math.max(0, Math.floor(currentTime || 0));
        url.searchParams.delete('t');
        url.searchParams.set('t', "".concat(time, "s"));
        return url.toString();
    }
    TimestampLinkUtils.buildTimestampLink = buildTimestampLink;
})(TimestampLinkUtils || (exports.TimestampLinkUtils = TimestampLinkUtils = {}));
