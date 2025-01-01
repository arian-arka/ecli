import {Command} from "../../../../class/Command";
import terminal from "../../../../decorator/terminal";
import validateProps from "../../../../decorator/validateProps";


export default class zod extends Command {

    @terminal({
        description: 'Generates typescript types and validations based on zod - currently supports -> Laravel',
        paras: {},
        examples: [],
    })

    @validateProps<Parameters<InstanceType<typeof zod>['index']>[0]>({
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false
    })
    async index(args: {}): Promise<any> {

    }

    @terminal({
        description: 'Generates typescript types and validations based on zod of laravel(rakutentechRequestDocs) apis',
        paras: {
            filter: {
                description: "a javascript arrow function that returns boolean ",
                example: "(req) => req.uri.startsWith('api')"
            },
            withPrefix: {
                description: 'boolean - filter endpoints that have prefix - default is "api@any"',
            },
            withoutPrefix: {
                description: "boolean - filter endpoints that dont have prefix - default is null",
            },
            api: {
                description: "uri of request docs - the default is in the example",
                example: "http://127.0.0.1:8000/request-docs/api?json=true&showGet=true&showPost=true&showDelete=true&showPut=true&showPatch=true&showHead=false&sort=default&groupby=default"
            },
            show: {
                description: "boolean - print output in stdout - default is false",
            },
            out: {
                description: "specify a file to write the output - it will rewrite if the file already exists",
            },
        },
        examples: [
            {
                example: `ecli front-end.generate.type  `
            },
            {
                example: `ecli front-end.generate.type  out:./types.ts`,
            }, {
                example: `ecli front-end.generate.type  show`,
            }, {
                example: `ecli front-end.generate.type  "filter:(r) => r.method === 'GET'"`,
                description: 'retrieve only apis that their http method is GET'
            }, {
                example: `ecli front-end.generate.type withPrefix:api/admin/suspend/{admin}@PUT`,
            }, {
                example: `ecli front-end.generate.type "withPrefix:api/admin/suspend/{admin}@PUT" "withPrefix:api/admin@POST" `,
            }, {
                example: `ecli front-end.generate.type "withPrefix:json:[ "api/admin/suspend/{admin}@PUT", "api:api/admin/suspend/{admin}@PUT" ]" `,
            },
        ],
    })

    @validateProps<Parameters<InstanceType<typeof zod>['index']>[0]>({
        type: "object",
        properties: {
            filter: {
                type: "string",
                nullable: true,
                default: null,
            },
            withPrefix: {
                "anyOf": [
                    {
                        type: "string",
                        nullable: true,
                        default: undefined,
                    },
                    {
                        type: "array",
                        nullable: true,
                        default: undefined,
                        items: {type: "string"}
                    }
                ]
            },
            withoutPrefix: {
                "anyOf": [
                    {
                        type: "string",
                        nullable: true,
                        default: undefined,
                    },
                    {
                        type: "array",
                        nullable: true,
                        default: undefined,
                        items: {type: "string"}
                    }
                ]
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
            show: {
                type: "boolean",
                nullable: true,
                default: false,
            },

        },
        required: [],
        additionalProperties: false
    })
    async laravel(args: {
        filter?: string,
        withoutPrefix?: string | string[],
        withPrefix?: string | string[],
        api?: string,
        out?: string,
        show?: boolean,
    }): Promise<any> {


    }
}