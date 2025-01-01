import {objectConvertors, rulesConvertors} from "../adaptor/laravel";

export type ILaravelConvertorDefaults = {
    required?: boolean
};
export type IObject = {
    [key: string]: {
        required: boolean,
        type?: 'numeric' | 'integer' | 'string' | 'decimal' | 'file' | 'boolean' | 'object' | 'array' | 'array-item'
        children: IObject | [(IObject[keyof IObject])],
        rules: string[],
    },

}

export class LaravelConvertor {
    static rulesToType(name: string, rules: { [key: string]: string[] }, defaults: ILaravelConvertorDefaults = {required:true}): string {
        const convertor = new LaravelConvertor();
        const obj = convertor.toObject(rules, defaults);
        const zodStr = convertor.toZodObject(name, obj);
        return zodStr;
    }

    private checkHasRule(rule: string, rules: string[], remove = true) {
        const index = rules.indexOf(rule);
        if (index === -1)
            return false;
        remove && rules.splice(index, 1);
        return true;
    }

    public toObject(rules: {
        [key: string]: string[]
    }, defaults: ILaravelConvertorDefaults): IObject {
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
                    tmpObj['children'] = [{
                        type: 'array-item',
                        required: defaults?.required ?? true,
                        rules: [],
                        children: {}
                    }];
                    tmpObj = tmpObj['children'][0];
                } else {
                    if (!(currentKey in tmpObj['children'])) {
                        // @ts-ignore
                        tmpObj['children'][currentKey] = {
                            type: undefined,
                            required: defaults?.required ?? true,
                            rules: [],
                            children: {}
                        }
                    }
                    // @ts-ignore
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
            else {
                for (let i = 0; i < values.length; i++) {
                    const v = values[i];
                    if (v.startsWith('decimal:')) {
                        tmpObj['type'] = 'numeric';
                        values.splice(i, 1);
                        break;
                    }
                    if (v.startsWith('array:')) {
                        tmpObj['type'] = 'object';
                        // @ts-ignore
                        v.substring(6).split(',').forEach(e => tmpObj['children'][e] = {
                            type: undefined,
                            required: defaults?.required ?? true,
                            rules: [],
                            children: {}
                        })
                        break;
                    }
                }
            }

            tmpObj['rules'] = values;

        }

        return obj;
    }

    public toZodObject(name: string, obj: IObject): string {

        const runThroughRules = (key: string, rules: string[], type: string) => {
            let text = '';

            if (rules.length) {
                rules.forEach(wholeRule => {
                    const indexOfQuote = wholeRule.indexOf(':');
                    let values: string[] = [];
                    if (indexOfQuote > -1)
                        values = wholeRule.substring(indexOfQuote + 1).split(',');
                    const rule = indexOfQuote > -1 ? wholeRule.substring(0, indexOfQuote) : wholeRule;
                    if (rule in rulesConvertors) { // @ts-ignore
                        text += '.' + rulesConvertors[rule](key, values, type) + '\n';
                    } else if (rule in objectConvertors) { // @ts-ignore
                        text += '.' + objectConvertors[rule](key, values, type) + '\n';
                    } else text += `/* @unknown-rule -> [ ${rule} ] */`

                });
            }

            return text;
        }

        const runThroughObject = (obj?: IObject): string => {
            if (!obj)
                return '';

            let text = '';

            for (const [key, value] of Object.entries(obj)) {
                text += `${key} : \n`;

                if (!value.type) {
                    if (Object.keys(value.children).length) {
                        value.type = 'object';
                        text += rulesConvertors.object(key, [runThroughObject((value.children as IObject) ?? undefined)], !value.required);
                    } else {
                        value.type = 'string';
                        text += rulesConvertors.string(key);
                    }
                } else if (value.type === 'numeric')
                    text += rulesConvertors.number(key);
                else if (value.type === 'integer')
                    text += rulesConvertors.integer(key);
                else if (value.type === 'string')
                    text += rulesConvertors.string(key);
                else if (value.type === 'file')
                    text += rulesConvertors.file(key, !value.required);
                else if (value.type === 'boolean')
                    text += rulesConvertors.boolean(key);
                else if (value.type === 'object')
                    text += rulesConvertors.object(key, [runThroughObject((value.children as IObject) ?? undefined)], !value.required);
                else if (value.type === 'array') {
                    // @ts-ignore
                    text += rulesConvertors.array(key, [runThroughObject(value.children)], !value.required);
                }

                text += runThroughRules(key, value.rules, value.type);

                text += ',\n';

            }

            return text;
        }

        return rulesConvertors.object('', [runThroughObject((obj['object'].children as IObject))], true);
    }

}