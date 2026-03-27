"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["LEFT"] = "left";
    Direction["RIGHT"] = "right";
})(Direction || (exports.Direction = Direction = {}));
var Action;
(function (Action) {
    Action["SELECT"] = "select";
    Action["BACK"] = "back";
})(Action || (exports.Action = Action = {}));
