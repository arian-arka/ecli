import {Command} from "../class/Command";
import {basePath} from "../helper/path";
import {File} from "../lib/File";
import assert from "node:assert";
import {commandToClsAndMethod} from "../helper/runCommand";
import terminal from "../decorator/terminal";

export default class explain extends Command {
    index(args: {
        command?: string
    }): any {
        if (!(!!args.command))
            return '"Explain" command explains other commands';

        const [method, cls, obj] = commandToClsAndMethod(args.command);
        if(!(method in obj.__terminal__)){
            console.log(args.command,'is not explainable');
            return;
        }
        const {description, paras} = obj.__terminal__[method] as Parameters<typeof terminal>[0];
        console.log('class:', obj.constructor.name);
        console.log('method:', method);
        console.log('description:', description);
        console.log('parameters:');
        for (const [key, value] of Object.entries(paras ?? {})) {
            console.log('   ',key,':',value?.description ?? '');
            console.log('      example:',value?.example ?? '');
            console.log('    ------------------');
        }
        return '';
    }
}