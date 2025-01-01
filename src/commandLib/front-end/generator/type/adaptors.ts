import {LaravelConvertor} from "./convertor/laravel";

type ILaravelRakutentechRequests = ({
    uri: string,
    http_method: string,
    method: string,
    controller_full_path: string,
    controller: string,
    middlewares: string[], // ["web","adminGranted:restore_admin"], ...
    path_parameters: {
        [key: string]: ["string"] //validation like integer|required
    },
    rules: {
        [key: string]: [string] // rule
    },

})[];

type ILaravelRakutentechUriValueRequest = {
    [key: string]: {
        uri: string,
        httpMethod: string,
        controllerMethod: string,
        controllerName: string,
        uriParameters: {
            [key: string]: {
                required: boolean,
                type: 'number' | 'integer' | 'string'
            }
        },
        hasFileInBody: boolean,
        okResponse: any,
        middlewares: string[],
        rules: { [key: string]: string[] },
        rulesObject: {
            zodObject:string,
            typescript:string,
        },
    }
};

type ILaravelRakutentechInjections = {
    [key: string]: {
        rules: { [key: string]: string[] },
        controllerMethod?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['controllerMethod'],
        controllerName?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['controllerName'],
        uriParameters?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['uriParameters'],
        hasFileInBody?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['hasFileInBody'],
        okResponse?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['okResponse'],
        middlewares?: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['middlewares'],
    },
};

class Adaptors {
    static async laravelRakutentechRequestDocs(args: {
        filter?: string,
        withoutPrefix?: string | string[],
        withPrefix?: string | string[],
        api?: string,
        injections?: ILaravelRakutentechInjections,
    }) {
        let filters: any[] = [];
        if (!!args.withPrefix)
            Array.isArray(args.withPrefix) ?
                (filters = [...filters, ...(args.withPrefix.map(_withPrefix => ((req: ILaravelRakutentechRequests[0]) => req.uri.startsWith(_withPrefix))))]) :
                filters.push((req: ILaravelRakutentechRequests[0]) => req.uri.startsWith((args.withPrefix as string) ?? ''));
        if (!!args.withoutPrefix)
            Array.isArray(args.withoutPrefix) ?
                (filters = [...filters, ...(args.withoutPrefix.map(_withoutPrefix => ((req: ILaravelRakutentechRequests[0]) => req.uri.startsWith(_withoutPrefix))))]) :
                filters.push((req: ILaravelRakutentechRequests[0]) => req.uri.startsWith((args.withPrefix as string) ?? ''));
        if (!!args.filter)
            filters.push((req: ILaravelRakutentechRequests[0]) => eval(`(${args.filter ?? ''})(req)`));
        const data = (await (await fetch(args.api ?? '')).json() as ILaravelRakutentechRequests).filter(r => {
            for (const f of filters) {
                if (!f(r))
                    return false;
            }
            return true;
        });


        function toKeyValue(requests: ILaravelRakutentechRequests, injections: ILaravelRakutentechInjections = {}): ILaravelRakutentechUriValueRequest {
            const newRequests: ILaravelRakutentechUriValueRequest = {};
            for (const r of requests) {
                const uri = r.uri;
                const httpMethod = r.http_method.toUpperCase();
                let controllerName = r.controller_full_path.split('\\').slice(3).join('');
                controllerName = controllerName.substring(0, controllerName.lastIndexOf('Controller'));
                const uriParameters: ILaravelRakutentechUriValueRequest[keyof ILaravelRakutentechUriValueRequest]['uriParameters'] = {};
                for (let p in r.path_parameters) {
                    const v = r.path_parameters[p][0];
                    const required = v.includes('required');
                    const integer = v.includes('integer');
                    const string = v.includes('string');
                    uriParameters[p] = {
                        required,
                        type: integer ? 'integer' : (string ? 'string' : 'integer')
                    }
                }
                let hasFileInBody = false;
                for (let k in r.rules) {
                    const rule = r.rules[k][0];
                    if (!(!!rule))
                        continue;
                    hasFileInBody = rule.split('|').find((v) => ['file', 'image', 'extensions', 'mimes', 'mimetypes'].includes(v)) != undefined;
                    if (hasFileInBody)
                        break;
                }
                const key = uri + '@' + httpMethod;
                const rules: { [key: string]: string[] } = {};
                for (const rulekey in r.rules ?? {})
                    rules[rulekey] = r.rules[rulekey][0].split('|');

                newRequests[key] = {
                    uri, httpMethod, uriParameters, controllerName,
                    controllerMethod: r.method,
                    okResponse: {type: 'string'},
                    middlewares: r.middlewares,
                    hasFileInBody,
                    rules,
                    rulesObject: LaravelConvertor.rulesToType(controllerName + '_' + r.method, rules),
                };
                if (key in injections) { // @ts-ignore
                    newRequests[key] = mergeDeep(newRequests[key], injections[key]);
                }
            }

            return newRequests;
        }

        return toKeyValue(data, args.injections);
    }


}