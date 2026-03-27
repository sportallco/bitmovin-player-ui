"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
var Guid;
(function (Guid) {
    var guid = 1;
    function next() {
        return guid++;
    }
    Guid.next = next;
})(Guid || (exports.Guid = Guid = {}));
