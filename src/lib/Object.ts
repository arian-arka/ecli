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

