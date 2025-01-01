"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../../class/Command");
const terminal_1 = __importDefault(require("../../../decorator/terminal"));
const validateProps_1 = __importDefault(require("../../../decorator/validateProps"));
const Object_1 = require("../../../lib/Object");
const File_1 = require("../../../lib/File");
const path_1 = require("../../../helper/path");
const laravelAdaptor_1 = __importDefault(require("../../zod/laravelAdaptor"));
class rakutentechRequestDocs extends Command_1.Command {
    async index(args) {
        var _a;
        console.log('args', args);
        const filters = [];
        if (!!args.withPrefix)
            filters.push((req) => { var _a; return req.uri.startsWith((_a = args.withPrefix) !== null && _a !== void 0 ? _a : ''); });
        if (!!args.withoutPrefix)
            filters.push((req) => { var _a; return !req.uri.startsWith((_a = args.withoutPrefix) !== null && _a !== void 0 ? _a : ''); });
        if (args.withController)
            filters.push((req) => !!req.controller);
        if (!!args.filter)
            filters.push((req) => { var _a; return eval(`(${(_a = args.filter) !== null && _a !== void 0 ? _a : ''})(req)`); });
        const requests = this.filterEndPoint(await this.fetchData((_a = args.uri) !== null && _a !== void 0 ? _a : ''), filters);
        const keyValue = await this.toKeyValue(requests);
        if (!!args.out) {
            File_1.Directory.create({
                path: args.out,
                check: false,
                recursive: true
            });
            File_1.File.writeJson({
                data: requests,
                path: (0, path_1.joinPaths)(args.out, 'requests.json')
            });
            File_1.File.writeJson({
                data: keyValue,
                path: (0, path_1.joinPaths)(args.out, 'keyValue.json')
            });
        }
    }
    async fetchData(uri) {
        const response = await fetch(uri);
        return await response.json();
    }
    filterEndPoint(requests, filters = []) {
        return requests.filter(r => {
            for (const f of filters) {
                if (!f(r))
                    return false;
            }
            return true;
        });
    }
    async toKeyValue(requests, injections = {}) {
        var _a;
        const newRequests = {};
        const adaptor = new laravelAdaptor_1.default;
        for (const r of requests) {
            const uri = r.uri;
            const httpMethod = r.http_method.toUpperCase();
            let controllerName = r.controller_full_path.split('\\').slice(3).join('');
            controllerName = controllerName.substring(0, controllerName.lastIndexOf('Controller'));
            const uriParameters = {};
            for (let p in r.path_parameters) {
                const v = r.path_parameters[p][0];
                const required = v.includes('required');
                const integer = v.includes('integer');
                const string = v.includes('string');
                uriParameters[p] = {
                    required,
                    type: integer ? 'integer' : (string ? 'string' : 'integer')
                };
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
            const rules = {};
            for (const rulekey in (_a = r.rules) !== null && _a !== void 0 ? _a : {})
                rules[rulekey] = r.rules[rulekey][0].split('|');
            newRequests[key] = {
                uri, httpMethod, uriParameters, controllerName,
                controllerMethod: r.method,
                okResponse: { type: 'string' },
                middlewares: r.middlewares,
                hasFileInBody,
                rules,
                rulesObject: await adaptor.index({ rules }),
            };
            if (key in injections) { // @ts-ignore
                newRequests[key] = (0, Object_1.mergeDeep)(newRequests[key], injections[key]);
            }
        }
        return newRequests;
    }
}
exports.default = rakutentechRequestDocs;
__decorate([
    (0, terminal_1.default)({
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
    }),
    (0, validateProps_1.default)({
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], rakutentechRequestDocs.prototype, "index", null);
