"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyMapForPlatform = getKeyMapForPlatform;
var types_1 = require("./types");
var BrowserUtils_1 = require("../utils/BrowserUtils");
var TizenKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isTizen; },
    keyCodes: {
        // D-pad Up
        38: types_1.Direction.UP,
        // D-pad Down
        40: types_1.Direction.DOWN,
        // D-pad Left
        37: types_1.Direction.LEFT,
        // D-pad Right
        39: types_1.Direction.RIGHT,
        // D-pad OK
        13: types_1.Action.SELECT,
        // Back
        10009: types_1.Action.BACK,
    },
};
var WebOsKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isWebOs; },
    keyCodes: {
        // D-pad Up
        38: types_1.Direction.UP,
        // D-pad Down
        40: types_1.Direction.DOWN,
        // D-pad Left
        37: types_1.Direction.LEFT,
        // D-pad Right
        39: types_1.Direction.RIGHT,
        // D-pad OK
        13: types_1.Action.SELECT,
        // Back
        461: types_1.Action.BACK,
    },
};
var PlayStationKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isPlayStation; },
    keyCodes: {
        // D-pad Up
        38: types_1.Direction.UP,
        // D-pad Down
        40: types_1.Direction.DOWN,
        // D-pad Left
        37: types_1.Direction.LEFT,
        // D-pad Right
        39: types_1.Direction.RIGHT,
        // Cross
        13: types_1.Action.SELECT,
        // Circle
        27: types_1.Action.BACK,
    },
};
var AndroidKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isAndroid; },
    keyCodes: {
        // D-pad Up
        38: types_1.Direction.UP,
        // D-pad Down
        40: types_1.Direction.DOWN,
        // D-pad Left
        37: types_1.Direction.LEFT,
        // D-pad Right
        39: types_1.Direction.RIGHT,
        // D-pad OK
        13: types_1.Action.SELECT,
        // Back
        27: types_1.Action.BACK,
    },
};
var HisenseKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isHisense; },
    keyCodes: {
        // D-pad Up
        38: types_1.Direction.UP,
        // D-pad Down
        40: types_1.Direction.DOWN,
        // D-pad Left
        37: types_1.Direction.LEFT,
        // D-pad Right
        39: types_1.Direction.RIGHT,
        // OK
        13: types_1.Action.SELECT,
        // Back
        8: types_1.Action.BACK,
    },
};
var XboxKeyMap = {
    isApplicable: function () { return BrowserUtils_1.BrowserUtils.isXbox; },
    keyCodes: {
        // D-pad Up
        203: types_1.Direction.UP,
        211: types_1.Direction.UP,
        // D-pad Down
        204: types_1.Direction.DOWN,
        212: types_1.Direction.DOWN,
        // D-pad Left
        205: types_1.Direction.LEFT,
        214: types_1.Direction.LEFT,
        // D-pad Right
        206: types_1.Direction.RIGHT,
        213: types_1.Direction.RIGHT,
        // A
        195: types_1.Action.SELECT,
    },
};
// Default key map used on desktops
var DefaultKeyMap = {
    // Arrow Up
    38: types_1.Direction.UP,
    // Arrow Down
    40: types_1.Direction.DOWN,
    // Arrow Left
    37: types_1.Direction.LEFT,
    // Arrow Right
    39: types_1.Direction.RIGHT,
    // Enter
    13: types_1.Action.SELECT,
    // Escape
    27: types_1.Action.BACK,
};
/**
 * Returns the matching key map for the current platform.
 */
function getKeyMapForPlatform() {
    var applicableKeyMap = [WebOsKeyMap, TizenKeyMap, PlayStationKeyMap, HisenseKeyMap, AndroidKeyMap, XboxKeyMap].find(function (keyMap) { return keyMap.isApplicable(); });
    if (applicableKeyMap) {
        return applicableKeyMap.keyCodes;
    }
    else {
        return DefaultKeyMap;
    }
}
