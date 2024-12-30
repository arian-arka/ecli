import {Command} from "../../class/Command";
import {basePath} from "../../helper/path";
import terminal from "../../decorator/terminal";
import validateProps from "../../decorator/validateProps";

type IObject = {
    [key: string]: {
        required: boolean,
        type?: 'numeric' | 'integer' | 'string' | 'decimal' | 'file' | 'boolean' | 'object' | 'array'
        children: IObject,
        rules: string[],
    },
}

export default class laravelAdaptor extends Command {
    @terminal({
        description: 'Converts laravel validation rules to zod validation and generated types',
        paras: {
            rules: {
                description: "json rules in the format of {[key:string] : string[]} ",
                example: '{"firstname":["required","string"]}'
            },
        }
    })

    @validateProps<Parameters<InstanceType<typeof laravelAdaptor>['index']>[0]>({
        type: "object",
        properties: {
            defaults: {
                type: 'object',
                nullable: true,
                properties: {
                    required: {type: "boolean", nullable: true, default: true}
                }
            },
            rules: {
                type: "object",
                required: [],
                additionalProperties: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        },
        required: ["rules"],
        additionalProperties: false
    })
    async index(args: {
        rules: { [key: string]: string[] },
        defaults?: {
            required?: boolean
        }
    }) {

    }


    private toObject(rules: { [key: string]: string[] },defaults : Parameters<InstanceType<typeof laravelAdaptor>['index']>[0]['defaults']): IObject {
        const obj: IObject = {
            'object': {
                required: true,
                type: 'object',
                children: {},
                rules: []
            }
        };

        for (const [wholeKeys, values] of Object.entries(rules)) {
            const keys = wholeKeys.split('.');
            let tmpObj = obj['object'];
            for (let i = 0; i < keys.length; i++) {
                const currentKey = keys[i];
                if (currentKey === '*') {
                    if (tmpObj['type'] !== 'array')
                        tmpObj['type'] = 'array';
                } else {
                    if (!(currentKey in tmpObj['children'])) {
                        tmpObj['children'][currentKey] = {
                            type: undefined,
                            required: defaults?.required ?? true,
                            rules: [],
                            children: {}
                        }
                    }
                    tmpObj = tmpObj['children'][currentKey];
                }
            }
            if (this.checkHasRule('nullable', values))
                tmpObj['required'] = false;
            if (this.checkHasRule('required', values))
                tmpObj['required'] = true;
            if (this.checkHasRule('numeric', values))
                tmpObj['type'] = 'numeric';
            else if (this.checkHasRule('integer', values))
                tmpObj['type'] = 'integer';
            else if (this.checkHasRule('digits', values))
                tmpObj['type'] = 'integer';
            else if (this.checkHasRule('list', values))
                tmpObj['type'] = 'array';
            else if (this.checkHasRule('array', values))//@it can be object, check for possiblity in childrens
                tmpObj['type'] = 'array';
            else if (this.checkHasRule('string', values))
                tmpObj['type'] = 'string';
            else if (this.checkHasRule('boolean', values))
                tmpObj['type'] = 'boolean';
            else if (this.checkHasRule('file', values))
                tmpObj['type'] = 'file';
            else if (this.checkHasRule('image', values, false))
                tmpObj['type'] = 'file';
            else if (this.checkHasDecimal(values))
                tmpObj['type'] = 'numeric';

            tmpObj['rules'] = values;

        }

        return obj;
    }

    private toZodObject(obj: IObject) : string{
        let text = '';

        return text;
    }

    private checkHasRule(rule: string, rules: string[], remove = true) {
        const index = rules.indexOf(rule);
        if (index === -1)
            return false;
        remove && rules.splice(index, 1);
        return true;
    }

    private checkHasDecimal(rules: string[]) {
        return rules.findIndex(e => e.startsWith('decimal:')) > -1;
    }
}