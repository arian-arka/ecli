export type IGather = <T, K extends keyof T>(data: T, keys: K[]) => ({
    [key in K]: T[K];
});
export type IGatherExcept = <T, K1 extends keyof T, K2 extends Exclude<keyof T, K1>>(data: T, keys: K1[]) => ({
    [key in K2]: T[K2];
});
export declare const gatherExcept: IGatherExcept;
export declare const gather: IGather;
export declare function isObject(item: any): any;
export declare function mergeDeep(target: any, ...sources: any[]): any;
