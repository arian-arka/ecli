"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = exports.run = exports.commandToClsAndMethod = exports.lookInDirective = void 0;
const path_1 = require("ecli-base/dist/src/lib/helper/path");
const File_1 = __importDefault(require("ecli-base/dist/src/lib/sys/File"));
const node_assert_1 = __importDefault(require("node:assert"));
const Args_1 = require("ecli-base/dist/src/lib/command/Args");
const Directory_1 = __importDefault(require("ecli-base/dist/src/lib/sys/Directory"));
const Terminal_1 = __importDefault(require("ecli-base/dist/src/lib/sys/Terminal"));
(0, path_1.setBasePath)((_b = (_a = require.main) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '');
function lookInDirective(splitted, def = 'default') {
    const name = splitted[0];
    const others = splitted.slice(1);
    (0, node_assert_1.default)(others.length > 0, `Directive without command - Invalid Command ${splitted.join('.')} `);
    const directivePath = (0, path_1.basePath)('custom-directive', name);
    (0, node_assert_1.default)(Directory_1.default.exists({ path: directivePath }), `Directive - Invalid Command ${splitted.join('.')} `);
    const obj = File_1.default.readJson({ path: (0, path_1.joinPaths)(directivePath, 'directive.json') });
    if (!!obj['build'])
        (0, Terminal_1.default)(`cd "${obj['base']}" && ${obj['build']}`);
    const actualPath = (0, path_1.joinPaths)(obj['base'], obj['commands']);
    (0, node_assert_1.default)(Directory_1.default.exists({ path: actualPath }), `Directive Path - Invalid Command ${splitted.join('.')} `);
    try {
        const cls = require((0, path_1.joinPaths)(actualPath, ...others))[def];
        return ['index', cls, new cls];
    }
    catch (e) {
        if (others.length > 1) {
            try {
                const cls = require((0, path_1.joinPaths)(actualPath, ...others.slice(0, others.length - 1)))[def];
                return [others[others.length - 1], cls, new cls];
            }
            catch (_e) {
                console.log(_e);
                (0, node_assert_1.default)(false, `Directive Module - Invalid Command ${splitted.join('.')}`);
            }
        }
        else {
            console.log(e);
            (0, node_assert_1.default)(false, `Directive Module - Invalid Command ${splitted.join('.')}`);
        }
    }
    return ['', '', ''];
}
exports.lookInDirective = lookInDirective;
function commandToClsAndMethod(command, def = 'default') {
    var _a;
    if (!(!!command)) {
        const self = require('./src/command/ecli').default;
        return ['index', self, new self];
    }
    const splitted = command.split('.');
    try {
        const cls = require('./src/command/' + splitted.join('/'))[def];
        return ['index', cls, new cls];
    }
    catch (e) {
        if (splitted.length > 1) {
            try {
                const cls = require('src/command/' + splitted.slice(0, splitted.length - 1).join('/'))[def];
                return [(_a = splitted.at(splitted.length - 1)) !== null && _a !== void 0 ? _a : '', cls, new cls];
            }
            catch (e) {
                return lookInDirective(splitted, def);
            }
        }
        else
            return lookInDirective(splitted, def);
    }
    return ['', '', ''];
}
exports.commandToClsAndMethod = commandToClsAndMethod;
async function run(command, args) {
    const [method, cls, obj] = commandToClsAndMethod(command);
    try {
        return {
            result: await obj[method](args),
            ok: true,
        };
    }
    catch (e) {
        return {
            result: e,
            ok: false,
        };
    }
}
exports.run = run;
async function runCli(stdout = true) {
    if (stdout) {
        console.log('base path: ', (0, path_1.basePath)());
    }
    if (!Args_1.command)
        return '';
    const output = await run(Args_1.command, Args_1.args);
    if (stdout) {
        console.log('Status: ', output.ok ? 'OK' : 'ERROR');
        console.log('Result:');
        // if (output.result instanceof Error)
        //     console.log(JSON.stringify(output.result, null, 2));
        // else
        console.log(output.result, null, 2);
    }
    return output;
}
exports.runCli = runCli;
(async () => await runCli())();
