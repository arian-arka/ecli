"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectConvertors = exports.rulesConvertors = void 0;
const langObject = 'messages';
const templates = {
    message: (key, validationKey, values) => { var _a; return `translate(${langObject}.validation.${validationKey}, '${key}', ${(_a = JSON.stringify(values)) !== null && _a !== void 0 ? _a : ''}) as string`; },
    refine: (condition, key, validationKey, values) => `refine((v) => ${condition} , {message : ${templates.message(key, validationKey, values)}}).innerType()`,
    superRefine: (condition, key, validationKey, values) => `superRefine((v,ctx) => {if( (()=> ${condition}) () ) ctx.addIssue({code:z.ZodIssueCode.custom, message : ${templates.message(key, validationKey, values)}}) }).innerType()`,
    regex: (condition, key) => `regex('${condition}', {message : ${templates.message(key, 'regex')}})`,
    convertKeysToIndexs(keys) {
        return keys.split('.').map(e => '[' + JSON.stringify(e) + ']').join('');
        // @to-implement
        // let text = ``;
        // let tmp = ``;
        // let counter = 0;
        // let varNum = 'i';
        // for (const key of keys.split('.')) {
        //     if (key === '*') {
        //         tmp += `[${varNum}]`;
        //         text += `for(let ${varNum} = 0; ${varNum}<v${tmp}.length;${varNum}++){ `;
        //         counter++;
        //         varNum+='i';
        //     } else {
        //         tmp += `['${key}']`;
        //     }
        // }
        // text += `if(v${})`;
        // for (let i = 0; i < counter; i++)
        //     text += '}';
    }
};
exports.rulesConvertors = {
    'file'(key, optional) {
        return 'z.any().' + templates.refine(`${optional ? '!v /* can be optional */ ||' : ''} v instanceof File`, key, 'file');
    },
    'number'(key) {
        return `number({required_error : ${templates.message(key, 'required')}, invalid_type_error : ${templates.message(key, 'number')} })`;
    },
    'nullable'() {
        return `optional().nullable()`;
    },
    'boolean'(key) {
        return `boolean({required_error : ${templates.message(key, 'required')}, invalid_type_error : ${templates.message(key, 'boolean')} })`;
    },
    'string'(key) {
        return `string({required_error : ${templates.message(key, 'required')}, invalid_type_error : ${templates.message(key, 'string')} })`;
    },
    'object'(key, values, optional) {
        return `object({ ${values.length ? values[0] : ''} },{required_error : ${templates.message(key, 'required')}, invalid_type_error : ${templates.message(key, 'object')} })` + (optional ? '.' + this.nullable() : '');
    },
    'array'(key, values, optional) {
        return `array({ ${values.length ? values[0] : ''} },{required_error : ${templates.message(key, 'required')}, invalid_type_error : ${templates.message(key, 'array')} })` + (optional ? '.' + this.nullable() : '');
    },
    'integer'(key) {
        return this.number(key) + '\n' + `.${templates.refine(`!\`\${v}\`.includes('.')`, key, 'integer')}`;
    },
    'uuid'(key) {
        return `uuid({message : ${templates.message(key, 'uuid')} })`;
    },
    'url'(key) {
        return `url({message : ${templates.message(key, 'url')} })`;
    },
    'email'(key) {
        return `url({message : ${templates.message(key, 'email')} })`;
    },
    'ip'(key) {
        return `url({message : ${templates.message(key, 'ip')} })`;
    },
    'ipv4'(key) {
        return `url({message : ${templates.message(key, 'ipv4')} })`;
    },
    'ipv6'(key) {
        return `url({message : ${templates.message(key, 'ipv6')} })`;
    },
    'alpha'(key) {
        return templates.regex(`/^[\\p{L}]+$/u`, key);
    },
    'alpha_ascii'(key) {
        return templates.regex(`/^[a-zA-Z]+$/i`, key);
    },
    'alpha_dash'(key) {
        return templates.regex(`/^[\\p{L}\\p{N}\\p{M}_-]+$/u`, key);
    },
    'alpha_dash_ascii'(key) {
        return templates.regex(`/^[a-zA-Z0-9_-]+$/i`, key);
    },
    'alpha_num'(key) {
        return templates.regex(`/^[\\p{L}\\p{N}\\p{M}]+$/u`, key);
    },
    'alpha_num_ascii'(key) {
        return templates.regex(`/^[a-zA-Z0-9]+$/i`, key);
    },
    'min'(key, value, type) {
        switch (type) {
            case 'integer':
            case 'number':
                return `lte(${value},{message: ${templates.message(key, 'lte_number')})`;
            case 'array':
                return templates.refine(`v.length <= ${value}`, key, 'lte_array');
            case 'file':
                return templates.refine(`v.size <= ${value}`, key, 'lte_file');
            default: //string
                return `lte(${value},{message: ${templates.message(key, 'lte_string')})`;
        }
    },
    'max'(key, value, type) {
        switch (type) {
            case 'integer':
            case 'number':
                return `gte(${value},{message: ${templates.message(key, 'gte_number')})`;
            case 'array':
                return templates.refine(`v.length >= ${value}`, key, 'gte_array');
            case 'file':
                return templates.refine(`v.size >= ${value}`, key, 'gte_file');
            default: //string
                return `gte(${value},{message: ${templates.message(key, 'gte_string')})`;
        }
    },
    'between'(key, values, type) {
        const [min, max] = values;
        return this.min(key, [min], type) + '.' + this.max(key, [max], type);
    },
    'contains'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(!v.includes(element)) return false;} return true;}`, key, 'contains');
    },
    'doesnt_contain'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(v.includes(element)) return false;} return true;}`, key, 'contains');
    },
    'accepted'(key) {
        return templates.refine(`v==="yes" || v==="on" || v==="1" || v===1 || v===true || v==="true"`, key, 'accepted');
    },
    'declined'(key) {
        return templates.refine(`v==="no" || v==="off" || v==="0" || v===0 || v===false || v==="false"`, key, 'declined');
    },
    'in'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; if(typeof(v) === 'string')return elements.includes(v);  for(const element of elements){if(!v.includes(element)) return false;} return true;}`, key, 'in', values);
    },
    'not_in'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; if(typeof(v) === 'string')return !elements.includes(v);  for(const element of elements){if(v.includes(element)) return true;} return false;}`, key, 'in', values);
    },
    'doesnt_start_with'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(v.startsWith(element)) return false;} return true;}`, key, 'doesnt_start_with', values);
    },
    'doesnt_end_with'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(v.endsWith(element)) return false;} return true;}`, key, 'doesnt_end_with', values);
    },
    'starts_with'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(v.startsWith(element)) return true;} return false;}`, key, 'starts_with', values);
    },
    'ends_with'(key, values) {
        const arrStr = values.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}]; for(const element of elements){if(v.endsWith(element)) return true;} return false;}`, key, 'ends_with', values);
    },
    'digits'(key, value) {
        return templates.refine(`(''+v+'').length === ${value[0]}`, key, 'digits', [value[0]]);
    },
    'max_digits'(key, value) {
        return templates.refine(`(''+v+'').length <= ${value[0]}`, key, 'max_digits', [value[0]]);
    },
    'min_digits'(key, value) {
        return templates.refine(`(''+v+'').length >= ${value[0]}`, key, 'min_digits', [value[0]]);
    },
    'digits_between'(key, value) {
        return templates.refine(`(''+v+'').length >= ${value[0]} && (''+v+'').length <= ${value[1]}`, key, 'digits_between', value);
    },
    'mimes'(key, value) {
        const arrStr = value.map(v => JSON.stringify(v)).join(', ');
        return templates.refine(`{const elements = [${arrStr}];  const ext = v.name.substring(v.name.lastIndexOf('.') + 1);return elements.includes(ext);}`, key, 'mimes');
    },
    'extensions'(key, value) {
        return this.mimes(key, value);
    },
    'image'(key) {
        return this.mimes(key, ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg', 'webp']);
    },
    'decimal'(key, value) {
        if (value.length == 1)
            return templates.refine(`{const __ = v.toString().split('.'); return __.length == 1 || __[1].length <= ${value[0]} ;}`, key, 'decimal', value);
        return templates.refine(`{const __ = v.toString().split('.'); return (__.length ${value[0] == '0' ? '==1 ||' : '>1 &&'} __[1].length >= ${value[0]} ) && (__.length==1 || __[1].length <= ${value[1]}) ;}`, key, 'decimal', value);
    },
    'distinct'(key, value) {
        if (!value.length)
            return templates.refine('{const isNumber = (n) => {try{return true}catch(e){return false}}; const newV=[]; for(const el of v) newV.push([undefined,null,NaN].includes(el) ? undefined : (isNumber(el) ? Number(el) : el) ) return (new Set(newV)).size === v.length};', key, 'distinct');
        if (value[0] === 'strict')
            return templates.refine('(new Set(v)).size === v.length', key, 'distinct');
        if (value[0] === 'ignore_case')
            return templates.refine('(new Set(v.map(e => typeof e === "string" ? e.toLowerCase() : e))).size === v.length', key, 'distinct');
    },
    'hex_color'(key, value) {
        return templates.regex('/^#([0-9a-f]{6}|[0-9a-f]{3})$/i', key);
    },
    'lowercase'(key, value) {
        return templates.refine(`v.toLowerCase() === v`, key, 'lowercase');
    },
    'multiple_of'(key, value) {
        return templates.refine(`v % ${value[0]} ===0`, key, 'multiple_of', value);
    },
    //implement missing
};
exports.objectConvertors = {
    'in_array'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        return templates.refine(`v${key2}.includes(v${key1})`, key, 'in_array', value);
    },
    'filled'(key, value, type) {
        const splitted = key.split('.');
        const last = splitted[splitted.length - 1];
        const key1 = templates.convertKeysToIndexs(splitted.slice(0, splitted.length - 1).join('.'));
        return templates.superRefine(`!(${last} in v${key1}) || ![undefined,NaN,null,''].includes(v${templates.convertKeysToIndexs(key)})`, key, 'filled');
    },
    'present'(key, value, type) {
        const splitted = key.split('.');
        const last = splitted[splitted.length - 1];
        const key1 = templates.convertKeysToIndexs(splitted.slice(0, splitted.length - 1).join('.'));
        return templates.superRefine(`(${last} in v${key1})`, key, 'present');
    },
    'confirmed'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0] + '_confirmation');
        return templates.superRefine(`v${key2} != ${value} || v${key1}==="yes" || v${key1}==="on" || v${key1}==="1" || v${key1}===1 || v${key1}===true || v${key1}==="true" `, key, 'confirmed', [value[0] + '_confirmation']);
    },
    'accepted_if'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        return templates.superRefine(`v${key2} != ${value} || v${key1}==="yes" || v${key1}==="on" || v${key1}==="1" || v${key1}===1 || v${key1}===true || v${key1}==="true" `, key, 'accepted_if', value);
    },
    'declined_if'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        return templates.superRefine(`v${key2} != ${value} || v${key1}==="no" || v${key1}==="off" || v${key1}==="0" || v${key1}===0 || v${key1}===false || v${key1}==="false" `, key, 'declined_if', value);
    },
    'different'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} !== v${key2}`, key1, 'gt', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size !== v${key2}.size`, key1, 'gt', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length !=== v${key2}.length`, key1, 'gt', [value[0]]);
        }
    },
    'same'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} === v${key2}`, key1, 'gt', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size === v${key2}.size`, key1, 'gt', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length ==== v${key2}.length`, key1, 'gt', [value[0]]);
        }
    },
    'gt'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} > v${key2}`, key, 'gt', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size > v${key2}.size`, key, 'gt', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length > v${key2}.length`, key, 'gt', [value[0]]);
        }
    },
    'lt'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} < v${key2}`, key, 'lt', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size < v${key2}.size`, key, 'lt', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length < v${key2}.length`, key, 'lt', [value[0]]);
        }
    },
    'gte'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} >= v${key2}`, key, 'gte', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size >= v${key2}.size`, key, 'gte', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length >= v${key2}.length`, key, 'gte', [value[0]]);
        }
    },
    'lte'(key, value, type) {
        const key1 = templates.convertKeysToIndexs(key);
        const key2 = templates.convertKeysToIndexs(value[0]);
        switch (type) {
            case 'integer':
            case 'number':
                return templates.superRefine(`v${key1} <= v${key2}`, key, 'lte', [value[0]]);
            case 'file':
                return templates.superRefine(`v${key1}.size <= v${key2}.size`, key, 'lte', [value[0]]);
            default: //string,array
                return templates.superRefine(`v${key1}.length <= v${key2}.length`, key, 'lte', [value[0]]);
        }
    },
};
