"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Var {
    static parseStr(str) {
        const lowerStr = str.toLowerCase();
        if (lowerStr === 'true')
            return true;
        if (lowerStr === 'false')
            return false;
        if (lowerStr === 'null')
            return null;
        if (lowerStr === 'undefined')
            return undefined;
        if (Var.isNumeric(str))
            return Number(str);
        return str;
    }
}
Var.isNumeric = (str) => typeof str !== "string" ? false : !isNaN(Number(str));
exports.default = Var;
