"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const File_1 = require("../../lib/File");
const node_child_process_1 = require("node:child_process");
class generate extends Command_1.Command {
    index(props) {
        const packageJson = {
            "name": "command",
            "version": "1.0.0",
            "description": "",
            "main": "dist/index.js",
            "types": "dist/index.d.ts",
            "scripts": {
                "build": "tsc",
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {
                "@types/node": "^20.12.10",
                "easy-node-cli": "github:arians-code-hub/easy-node-cli",
                "typescript": "^5.4.5"
            }
        };
        const tsConfig = {
            "compilerOptions": {
                "target": "es2019",
                "outDir": "./dist",
                "module": "CommonJS",
                "esModuleInterop": true,
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "skipLibCheck": true
            },
            "include": [
                "./**/*.ts",
                "./*.ts"
            ]
        };
        File_1.File.writeJson({
            path: props.path + '/package.json',
            data: packageJson
        });
        File_1.File.writeJson({
            path: props.path + '/tsconfig.json',
            data: tsConfig
        });
        File_1.File.create({
            path: props.path + '/src/args.ts',
            data: `import process from "process";

const isNumeric = (str: any) => typeof str !== "string" ? false : !isNaN(Number(str));

export function convertArgs(args: string[]) {
    const data: { [key: string]: string | boolean | number | ((boolean | number | string)[]) } = {};
    for (let arg of args) {
        if (!(!!arg))
            continue;
        const index = arg.indexOf(':');

        let _val: any;
        let _key: any = arg;

        if (index == -1)
            _val = true;
        else if (index === arg.length - 1) {
            _val = false;
            _key = arg.substring(0, index);
        } else {
            _key = arg.substring(0, index);
            const tmp = arg.substring(index + 1);
            _val = isNumeric(tmp) ? Number(tmp) : tmp;
        }
        if (_key in data) {
            if (Array.isArray(data[_key])) { // @ts-ignore
                data[_key].push(_val);
            } else
                data[_key] = [data[_key], _val];
        } else data[_key] = _val;
    }
    return data;
}

export function argsToStr(args : {[key : string] : string | boolean | number | ((boolean | number | string)[])}) : string{
    let s = '';
    for(let key in args){
        const val = args[key];
        if(val === true)
            s+=\` \${key} \`;
        else if(val === false)
            s+=\` \${key}: \`;
        else if(typeof val === 'string' || typeof val === 'number')
            s+=\` "\${key}:\${val}"; \`
        else{
            for(let item of val)
                if(item === true)
                    s+=\` \${key} \`;
                else if(item === false)
                    s+=\` \${key}: \`;
                else if(typeof item === 'string' || typeof item === 'number')
                    s+=\` "\${key}:\${item}"; \`
        }
    }
    return s;
}

const allArgs = process.argv.slice(2);

let _command = allArgs.length ? convertArgs([allArgs[0]]) : undefined;

export const command = _command ? Object.keys(_command)[0] : undefined;
export const commandMethod = _command ? Object.values(_command)[0] : undefined;

export const args = allArgs.length > 1 ? convertArgs(allArgs.slice(1)) : {};


`
        });
        File_1.File.create({
            path: props.path + '/src/runCommand.ts',
            data: `import * as args from "./args";

export function run(command: string, method:any, args: any): any {
    const cls = require('./command/' + command).default;
    const obj = new cls;
    const m = typeof method === 'string' && !!method ? method : 'index';
    return obj[m](args);
}

export function runCli() {
    if (!(!!args.command)) {
        console.log('Empty');
        return undefined;
    }
    return run(args.command, args.commandMethod, args.args);
}

`
        });
        File_1.File.create({
            path: props.path + '/src/command/hello.ts',
            data: `import {Command} from "easy-node-cli/dist/src/class/Command";
import {basePath} from "easy-node-cli/dist/src/helper/path";

export default class hello extends Command{
   index(args : any): any {
       console.log('index of hello! ',args);
       console.log('base',basePath());
   }
}`
        });
        File_1.File.create({
            path: props.path + '/index.ts',
            data: `import {runCli} from "./src/runCommand";

console.log('< return >');
console.log(runCli());`
        });
        (0, node_child_process_1.execSync)(`cd ${props.path} && npm i`);
    }
}
exports.default = generate;
