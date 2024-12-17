import path from "node:path";
export function moduleBasePath() : string|undefined{
    return require.main?.path;
}
export function basePath(...args : string[]) : string{
    const module = moduleBasePath();
    const base = !!module ? module+'/../../' : './';
    return path.resolve(base,...args);
}