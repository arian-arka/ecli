"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.args = exports.command = void 0;
const process_1 = __importDefault(require("process"));
const node_assert_1 = __importDefault(require("node:assert"));
const Var_1 = __importDefault(require("./Var"));
const File_1 = require("./File");
class Args {
    constructor(data) {
        this.data = data;
    }
    convertArg(str) {
        const objs = {
            'json:': () => {
                let rest = str.substring(5);
                console.log('####jsonn', rest);
                if (!(!!rest))
                    return {};
                try {
                    return JSON.parse(rest);
                }
                catch (e) {
                    throw new Error('Arg is not valid json: ' + str);
                }
            },
            'string:': () => str.substring(7),
            'json_file:': () => {
                let rest = str.substring(10);
                (0, node_assert_1.default)(!!rest && File_1.File.exists({ path: rest }), 'Arg is not valid file: ' + str);
                try {
                    return File_1.File.readJson({ path: rest });
                }
                catch (e) {
                    throw new Error('Arg is not valid json file: ' + str);
                }
            },
            'file:': () => {
                let rest = str.substring(5);
                (0, node_assert_1.default)(!!rest && File_1.File.exists({ path: rest }), 'Arg is not valid file: ' + str);
                return File_1.File.read({ path: rest });
            }
        };
        for (const [key, func] of Object.entries(objs)) {
            if (!str.startsWith(key))
                continue;
            const val = func();
            if (val)
                return val;
        }
        return Var_1.default.parseStr(str);
    }
    parseArg(arg, obj) {
        if (!(!!arg))
            return;
        (0, node_assert_1.default)(typeof arg === 'string', 'Args must be array of strings: ' + arg);
        const indexOfQuote = arg.indexOf(':');
        (0, node_assert_1.default)(indexOfQuote == -1 || indexOfQuote, 'Invalid arg(wrong position of quote): ' + arg);
        let key;
        let value = undefined;
        if (indexOfQuote === arg.length - 1) {
            key = arg.substring(0, arg.length - 1);
            value = true;
        }
        else if (indexOfQuote == -1) {
            key = arg;
        }
        else {
            key = arg.substring(0, indexOfQuote);
            value = this.convertArg(arg.substring(indexOfQuote + 1));
        }
        if (key in obj) {
            if (Array.isArray(obj[key]))
                obj[key].push(value);
            else
                obj[key] = [obj[key], value];
        }
        else
            obj[key] = value;
    }
    make() {
        const data = {};
        if (!this.data || !(!!this.data) || !this.data.length)
            return data;
        (0, node_assert_1.default)(!Array.isArray(data), 'Args must be array of strings');
        for (const el of this.data)
            this.parseArg(el, data);
        return data;
    }
    static parse(data) {
        return (new Args(data)).make();
    }
    static parseProcess() {
        return Args.parse(process_1.default.argv.slice(2));
    }
    static parseProcessAsCommand() {
        const command = process_1.default.argv[2];
        return {
            command: !!command ? command : undefined,
            args: Args.parse(process_1.default.argv.slice(!!command ? 3 : 2)),
        };
    }
}
exports.default = Args;
_a = Args.parseProcessAsCommand(), exports.command = _a.command, exports.args = _a.args;
