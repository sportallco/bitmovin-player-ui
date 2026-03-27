"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekBarController = exports.SeekBarType = void 0;
var UIUtils_1 = require("./UIUtils");
var SeekBarType;
(function (SeekBarType) {
    SeekBarType[SeekBarType["Vod"] = 0] = "Vod";
    SeekBarType[SeekBarType["Live"] = 1] = "Live";
    SeekBarType[SeekBarType["Volume"] = 2] = "Volume";
})(SeekBarType || (exports.SeekBarType = SeekBarType = {}));
var coerceValueIntoRange = function (value, range, cb) {
    if (value < range.min) {
        cb(range.min);
    }
    else if (value > range.max) {
        cb(range.max);
    }
    else {
        cb(value);
    }
};
/**
 * @category Utils
 */
var SeekBarController = /** @class */ (function () {
    function SeekBarController(keyStepIncrements, player, volumeController) {
        this.keyStepIncrements = keyStepIncrements;
        this.player = player;
        this.volumeController = volumeController;
    }
    SeekBarController.prototype.arrowKeyControls = function (currentValue, range, valueUpdate) {
        var _this = this;
        var controlValue = Math.floor(currentValue);
        return {
            left: function () { return coerceValueIntoRange(controlValue - _this.keyStepIncrements.leftRight, range, valueUpdate); },
            right: function () { return coerceValueIntoRange(controlValue + _this.keyStepIncrements.leftRight, range, valueUpdate); },
            up: function () { return coerceValueIntoRange(controlValue + _this.keyStepIncrements.upDown, range, valueUpdate); },
            down: function () { return coerceValueIntoRange(controlValue - _this.keyStepIncrements.upDown, range, valueUpdate); },
            home: function () { return coerceValueIntoRange(range.min, range, valueUpdate); },
            end: function () { return coerceValueIntoRange(range.max, range, valueUpdate); },
        };
    };
    SeekBarController.prototype.seekBarControls = function (type) {
        var _this = this;
        if (type === SeekBarType.Live) {
            return this.arrowKeyControls(this.player.getTimeShift(), { min: this.player.getMaxTimeShift(), max: 0 }, function (value) { return _this.player.timeShift(value); });
        }
        else if (type === SeekBarType.Vod) {
            return this.arrowKeyControls(this.player.getCurrentTime(), { min: 0, max: this.player.getDuration() }, function (value) { return _this.player.seek(value); });
        }
        else if (type === SeekBarType.Volume && this.volumeController != null) {
            var volumeTransition = this.volumeController.startTransition();
            return this.arrowKeyControls(this.player.getVolume(), { min: 0, max: 100 }, volumeTransition.finish.bind(volumeTransition));
        }
    };
    SeekBarController.prototype.setSeekBarControls = function (domElement, type) {
        var _this = this;
        domElement.on('keydown', function (e) {
            var controls = _this.seekBarControls(type());
            switch (e.keyCode) {
                case UIUtils_1.UIUtils.KeyCode.LeftArrow: {
                    controls.left();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.RightArrow: {
                    controls.right();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.UpArrow: {
                    controls.up();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.DownArrow: {
                    controls.down();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.Home: {
                    controls.home();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.End: {
                    controls.end();
                    e.preventDefault();
                    break;
                }
                case UIUtils_1.UIUtils.KeyCode.Space: {
                    _this.player.isPlaying() ? _this.player.pause() : _this.player.play();
                    e.preventDefault();
                    break;
                }
            }
        });
    };
    return SeekBarController;
}());
exports.SeekBarController = SeekBarController;
