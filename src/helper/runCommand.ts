import {
    command, args
} from "../lib/Args";
import {Directory, File} from "../lib/File";
import assert from "node:assert";
export function commandToClsAndMethod(command:string,def = 'default') : [string,string,any]{
    const splitted = command.split('.');
    let method = 'index', path = '../command/';
    if (File.isFile({path: './src/command/' + splitted.join('/') + '.ts'})) {
        path += splitted.join('/');
    } else {
        assert(splitted.length > 1, 'Invalid command');
        method = splitted[splitted.length - 1];
        path += splitted.slice(0, splitted.length - 1).join('/');
    }
    const cls = require(path)[def];
    return [method,cls,new cls];
}
export async function run(command: string, args: any): Promise<any> {
    const [method,cls,obj] = commandToClsAndMethod(command);

    return await obj[method](args);
}

export async function runCli() {
    if (!command)
        return '';
    return await run(command, args);
}
