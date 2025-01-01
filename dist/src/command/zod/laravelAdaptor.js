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
const Command_1 = require("../../class/Command");
const terminal_1 = __importDefault(require("../../decorator/terminal"));
const validateProps_1 = __importDefault(require("../../decorator/validateProps"));
class laravelAdaptor extends Command_1.Command {
    async index(args) {
        return this.toObject(args.rules, args.defaults);
    }
    checkHasRule(rule, rules, remove = true) {
        const index = rules.indexOf(rule);
        if (index === -1)
            return false;
        remove && rules.splice(index, 1);
        return true;
    }
    toObject(rules, defaults) {
        var _a, _b;
        const obj = {
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
                            required: (_a = defaults === null || defaults === void 0 ? void 0 : defaults.required) !== null && _a !== void 0 ? _a : true,
                            rules: [],
                            children: {}
                        }];
                    tmpObj = tmpObj['children'][0];
                }
                else {
                    if (!(currentKey in tmpObj['children'])) {
                        // @ts-ignore
                        tmpObj['children'][currentKey] = {
                            type: undefined,
                            required: (_b = defaults === null || defaults === void 0 ? void 0 : defaults.required) !== null && _b !== void 0 ? _b : true,
                            rules: [],
                            children: {}
                        };
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
            else if (this.checkHasRule('array', values)) //@it can be object, check for possiblity in childrens
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
                        v.substring(6).split(',').forEach(e => {
                            var _a;
                            return tmpObj['children'][e] = {
                                type: undefined,
                                required: (_a = defaults === null || defaults === void 0 ? void 0 : defaults.required) !== null && _a !== void 0 ? _a : true,
                                rules: [],
                                children: {}
                            };
                        });
                        values.splice(i, 1);
                        break;
                    }
                }
            }
            tmpObj['rules'] = values;
        }
        return obj;
    }
}
exports.default = laravelAdaptor;
__decorate([
    (0, terminal_1.default)({
        description: 'Converts laravel validation rules to zod validation and generated types',
        paras: {
            rules: {
                description: "json rules in the format of {[key:string] : string[]} ",
                example: '{"firstname":["required","string"]}'
            },
        }
    }),
    (0, validateProps_1.default)({
        type: "object",
        properties: {
            defaults: {
                type: 'object',
                nullable: true,
                properties: {
                    required: { type: "boolean", nullable: true, default: true }
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], laravelAdaptor.prototype, "index", null);
