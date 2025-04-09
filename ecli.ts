import {basePath, joinPaths, setBasePath} from "ecli-base/dist/src/lib/helper/path";
import File from "ecli-base/dist/src/lib/sys/File";
import assert from "node:assert";
import {command, args} from "ecli-base/dist/src/lib/command/Args";
import Directory from "ecli-base/dist/src/lib/sys/Directory";
import Terminal from "ecli-base/dist/src/lib/sys/Terminal";

setBasePath(require.main?.path ?? '');

export function lookInDirective(splitted: string[], def = 'default'): [string, string, any] {
    const name = splitted[0];
    const others = splitted.slice(1);
    assert(others.length > 0, `Directive without command - Invalid Command ${splitted.join('.')} `);

    const directivePath = basePath('custom-directive', name);
    assert(Directory.exists({path: directivePath}), `Directive - Invalid Command ${splitted.join('.')} `);

    const obj: any = File.readJson({path: joinPaths(directivePath, 'directive.json')});

    if (!!obj['build'])
        Terminal(`cd "${obj['base']}" && ${obj['build']}`);

    const actualPath = joinPaths(obj['base'], obj['commands']);
    assert(Directory.exists({path: actualPath}), `Directive Path - Invalid Command ${splitted.join('.')} `);

    try {
        const cls = require(joinPaths(actualPath, ...others))[def];
        return ['index', cls, new cls];
    } catch (e) {
        if (others.length > 1) {
            try {
                const cls = require(joinPaths(actualPath, ...others.slice(0, others.length - 1)))[def];
                return [others[others.length - 1], cls, new cls];
            } catch (_e) {
                console.log(_e);
                assert(false, `Directive Module - Invalid Command ${splitted.join('.')}`);
            }

        } else {
            console.log(e);
            assert(false, `Directive Module - Invalid Command ${splitted.join('.')}`);
        }
    }
    return ['', '', ''];
}

export function commandToClsAndMethod(command: string, def = 'default'): [string, string, any] {
    if (!(!!command)) {
        const self = require('./src/command/ecli').default;
        return ['index', self, new self];
    }
    const splitted = command.split('.');
    try {
        const cls = require('./src/command/' + splitted.join('/'))[def];
        return ['index', cls, new cls];
    } catch (e) {
        if (splitted.length > 1) {
            try {
                const cls = require('src/command/' + splitted.slice(0, splitted.length - 1).join('/'))[def];
                return [splitted.at(splitted.length - 1) ?? '', cls, new cls];
            } catch (e) {
                return lookInDirective(splitted, def);
            }
        } else return lookInDirective(splitted, def);
    }
    return ['', '', ''];
}

export async function run(command: string, args: any) {
    const [method, cls, obj] = commandToClsAndMethod(command);

    try {
        return {
            result: await obj[method](args),
            ok: true,
        };
    } catch (e) {
        return {
            result: e,
            ok: false,
        }
    }
}

export async function runCli(stdout = true) {
    if (stdout) {
        console.log('base path: ', basePath());
    }
    if (!command)
        return '';
    const output = await run(command, args);

    if (stdout) {
        console.log('Status: ', output.ok ? 'OK' : 'ERROR');
        console.log('Result:');
        // if (output.result instanceof Error)
        //     console.log(JSON.stringify(output.result, null, 2));
        // else
             console.log(output.result, null, 2);
    }
    if(!output.ok)
        throw output.result;

    return output;
}

(async () => await runCli())();

