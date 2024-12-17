"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gather = exports.gatherExcept = void 0;
// @ts-ignore
const gatherExcept = (data, keys) => {
    const d = {};
    for (let k in data) { // @ts-ignore
        if (!keys.includes(k)) { // @ts-ignore
            d[k] = data[k];
        }
    }
    return d;
};
exports.gatherExcept = gatherExcept;
// @ts-ignore
const gather = (data, keys) => {
    const d = {};
    for (let k in data) { // @ts-ignore
        if (keys.includes(k)) { // @ts-ignore
            d[k] = data[k];
        }
    }
    return d;
};
exports.gather = gather;
