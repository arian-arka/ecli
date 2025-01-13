import terminal from "ecli-base/dist/src/decorator/terminal";
import {Command} from "ecli-base/dist/src/lib/command/Command";
import {commandToClsAndMethod} from "../../ecli";
import assert from "node:assert";

export default class explain extends Command {
    index(args: {
        command?: string
    }): any {
        if (!(!!args.command))
            return '"Explain" command explains other commands';

        const [method, cls, obj] = commandToClsAndMethod(args.command);
        assert(method in (obj?.__terminal__ ?? {}),  `${args.command},is not explainable`);

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