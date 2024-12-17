import process from "process";
import assert from "node:assert";
import Var from "./Var";
import {File} from "./File";

export default class Args {

    constructor(private readonly data: unknown) {
    }

    convertArg(str: string): null | undefined | number | boolean | string | object {
        const objs = {
            'json:': () => {
                let rest = str.substring(5);
                console.log('####jsonn', rest);
                if (!(!!rest))
                    return {};
                try {
                    return JSON.parse(rest);
                } catch (e) {
                    throw new Error('Arg is not valid json: ' + str);
                }
            },
            'string:': () => str.substring(7),
            'json_file:': () => {
                let rest = str.substring(10);
                assert(!!rest && File.exists({path: rest}), 'Arg is not valid file: ' + str);
                try {
                    return File.readJson({path: rest});
                } catch (e) {
                    throw new Error('Arg is not valid json file: ' + str);
                }
            },
            'file:': () => {
                let rest = str.substring(5);
                assert(!!rest && File.exists({path: rest}), 'Arg is not valid file: ' + str);
                return File.read({path: rest});
            }
        };
        for (const [key, func] of Object.entries(objs)) {
            if (!str.startsWith(key)) continue;
            const val = func();
            if (val)
                return val;
        }

        return Var.parseStr(str);
    }


    private parseArg(arg: unknown, obj: any): unknown {
        if (!(!!arg))
            return;

        assert(typeof arg === 'string', 'Args must be array of strings: ' + arg);

        const indexOfQuote = arg.indexOf(':');

        assert(indexOfQuote == -1 || indexOfQuote, 'Invalid arg(wrong position of quote): ' + arg);

        let key: string
        let value: any = undefined;

        if (indexOfQuote === arg.length - 1) {
            key = arg.substring(0, arg.length - 1);
            value = true;
        } else if (indexOfQuote == -1) {
            key = arg;
        } else {
            key = arg.substring(0, indexOfQuote);
            value = this.convertArg(arg.substring(indexOfQuote + 1));
        }

        if (key in obj) {
            if (Array.isArray(obj[key]))
                obj[key].push(value);
            else
                obj[key] = [obj[key], value];
        } else obj[key] = value;

    }

    make(): object {
        const data: object = {};
        if (!this.data || !(!!this.data) || !(this.data as unknown[]).length)
            return data;

        assert(!Array.isArray(data), 'Args must be array of strings');

        for (const el of this.data as unknown[])
            this.parseArg(el, data);

        return data;
    }

    static parse(data: unknown): object {
        return (new Args(data)).make();
    }

    static parseProcess(): object {
        return Args.parse(process.argv.slice(2));
    }

    static parseProcessAsCommand(): { command?: string, args: object } {
        const command = process.argv[2];
        return {
            command: !!command ? command : undefined,
            args: Args.parse(process.argv.slice(!!command ? 3 : 2)),
        };
    }
}

export const {command, args} = Args.parseProcessAsCommand();
