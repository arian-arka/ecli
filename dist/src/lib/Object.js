"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = exports.isObject = exports.gather = exports.gatherExcept = void 0;
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
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
exports.isObject = isObject;
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
exports.mergeDeep = mergeDeep;
