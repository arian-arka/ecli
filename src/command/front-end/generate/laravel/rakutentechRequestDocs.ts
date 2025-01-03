import {Command} from "../../../class/Command";
import terminal from "../../../decorator/terminal";
import validateProps from "../../../decorator/validateProps";
import {mergeDeep} from "../../../lib/Object";
import {Directory, File} from "../../../lib/File";
import {joinPaths} from "../../../helper/path";
import laravelAdaptor from "../../zod/laravelAdaptor";

type IRequests = ({
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
type IInjections = {
    [key: string]: {
        rules: { [key: string]: string[] },
        controllerMethod?: IUriValueRequest[keyof IUriValueRequest]['controllerMethod'],
        controllerName?: IUriValueRequest[keyof IUriValueRequest]['controllerName'],
        uriParameters?: IUriValueRequest[keyof IUriValueRequest]['uriParameters'],
        hasFileInBody?: IUriValueRequest[keyof IUriValueRequest]['hasFileInBody'],
        okResponse?: IUriValueRequest[keyof IUriValueRequest]['okResponse'],
        middlewares?: IUriValueRequest[keyof IUriValueRequest]['middlewares'],
    },
};
type IUriValueRequest = {
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
        rulesObject: any,
    }
};

export default class rakutentechRequestDocs extends Command {
    @terminal({
        description: 'sample description',
        paras: {
            filter: {
                description: "a javascript arrow function that returns boolean ",
                example: "(req) => req.uri.startsWith('api')"
            },
            withController: {
                description: "boolean - filter endpoints with controllers - default is true ",
            },
            withPrefix: {
                description: 'boolean - filter endpoints that have prefix - default is "api"',
            },
            withoutPrefix: {
                description: "boolean - filter endpoints that dont have prefix - default is null",
            },
            uri: {
                description: "uri of request docs - the default is in the example",
                example: "http://127.0.0.1:8000/request-docs/api?json=true&showGet=true&showPost=true&showDelete=true&showPut=true&showPatch=true&showHead=false&sort=default&groupby=default"
            }
        }
    })

    @validateProps<Parameters<InstanceType<typeof rakutentechRequestDocs>['index']>[0]>({
        type: "object",
        properties: {
            filter: {
                type: "string",
                nullable: true,
                default: null,
            },
            withPrefix: {
                type: "string",
                nullable: true,
                default: 'api',
            },
            withoutPrefix: {
                type: "string",
                nullable: true,
                default: null,
            },
            withController: {
                type: "boolean",
                nullable: true,
                default: true,
            },
            uri: {
                type: "string",
                nullable: true,
                format: 'uri',
                default: 'http://127.0.0.1:8000/request-docs/api?json=true&showGet=true&showPost=true&showDelete=true&showPut=true&showPatch=true&showHead=false&sort=default&groupby=default'
            },
            out: {
                type: "string",
                nullable: true,
                default: undefined,
            },
        },
        required: [],
        additionalProperties: false,
    })
    async index(args: {
        uri?: string,
        withController?: boolean,
        withPrefix?: string,
        withoutPrefix?: string,
        filter?: string,
        out?: string,
    }) {
        console.log('args', args);
        const filters = [];
        if (!!args.withPrefix)
            filters.push((req: IRequests[0]) => req.uri.startsWith(args.withPrefix ?? ''));
        if (!!args.withoutPrefix)
            filters.push((req: IRequests[0]) => !req.uri.startsWith(args.withoutPrefix ?? ''));
        if (args.withController)
            filters.push((req: IRequests[0]) => !!req.controller);
        if (!!args.filter)
            filters.push((req: IRequests[0]) => eval(`(${args.filter ?? ''})(req)`));
        const requests = this.filterEndPoint(
            await this.fetchData(args.uri ?? ''), filters
        );
        const keyValue = await this.toKeyValue(requests);


        if (!!args.out) {
            Directory.create({
                path: args.out,
                check: false,
                recursive: true
            });
            File.writeJson({
                data: requests,
                path: joinPaths(args.out, 'requests.json')
            });
            File.writeJson({
                data: keyValue,
                path: joinPaths(args.out, 'keyValue.json')
            });
        }

    }

    private async fetchData(uri: string): Promise<IRequests> {
        const response = await fetch(uri);
        return await response.json();
    }

    private filterEndPoint(requests: IRequests, filters: (Function)[] = []): IRequests {
        return requests.filter(r => {
            for (const f of filters) {
                if (!f(r))
                    return false;
            }
            return true;
        });
    }

    private async toKeyValue(requests: IRequests, injections: IInjections = {}): Promise<IUriValueRequest> {
        const newRequests: IUriValueRequest = {};
        const adaptor = new laravelAdaptor;
        for (const r of requests) {
            const uri = r.uri;
            const httpMethod = r.http_method.toUpperCase();
            let controllerName = r.controller_full_path.split('\\').slice(3).join('');
            controllerName = controllerName.substring(0, controllerName.lastIndexOf('Controller'));
            const uriParameters: IUriValueRequest[keyof IUriValueRequest]['uriParameters'] = {};
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
                rulesObject: await adaptor.index({name: controllerName + '_' + r.method, rules}),
            };
            if (key in injections) { // @ts-ignore
                newRequests[key] = mergeDeep(newRequests[key], injections[key]);
            }
        }

        return newRequests;
    }


}