export type IGather = <T, K extends keyof T>(data: T, keys: K[]) => ({ [key in K]: T[K] });
export type IGatherExcept = <T,K1 extends keyof T,K2 extends Exclude<keyof T, K1>>(data: T, keys: K1[]) => ({ [key in K2]: T[K2] });

// @ts-ignore
export const gatherExcept: IGatherExcept = (data, keys) => {
    const d = {};
    for (let k in data) { // @ts-ignore
        if (!keys.includes(k)) { // @ts-ignore
            d[k] = data[k];
        }
    }
    return d;
};
// @ts-ignore
export const gather: IGather = (data, keys) => {
    const d = {};
    for (let k in data) { // @ts-ignore
        if (keys.includes(k)) { // @ts-ignore
            d[k] = data[k];
        }
    }
    return d;
}


export function isObject(item : any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}


export function mergeDeep(target : any, ...sources:any[]) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
