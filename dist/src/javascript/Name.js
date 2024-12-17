"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Name = void 0;
class Name {
    static iName(name, rest = '') {
        return `I${name}${rest}`;
    }
    static cName(name, rest = '') {
        return `C${name}${rest}`;
    }
}
exports.Name = Name;
