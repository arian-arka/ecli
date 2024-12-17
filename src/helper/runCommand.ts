import {
    command,args
} from "../lib/Args";
import {Directory} from "../lib/File";

export function run(command: string, args: any): any {
    const [cls,method] = command.split('.');
    let path = '../command/' + cls;

    if(Directory.isDir({path : './src/command/'+cls}))
        path+=`/${cls}`;

    const obj = new (require(path).default);

    return obj[!!method ? method : 'index'](args);
}

export function runCli() {
    if (!command)
        return '';
    return run(command, args);
}
