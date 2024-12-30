"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../class/Command");
const runCommand_1 = require("../helper/runCommand");
class explain extends Command_1.Command {
    index(args) {
        var _a, _b;
        if (!(!!args.command))
            return '"Explain" command explains other commands';
        const [method, cls, obj] = (0, runCommand_1.commandToClsAndMethod)(args.command);
        if (!(method in obj.__terminal__)) {
            console.log(args.command, 'is not explainable');
            return;
        }
        const { description, paras } = obj.__terminal__[method];
        console.log('class:', obj.constructor.name);
        console.log('method:', method);
        console.log('description:', description);
        console.log('parameters:');
        for (const [key, value] of Object.entries(paras !== null && paras !== void 0 ? paras : {})) {
            console.log('   ', key, ':', (_a = value === null || value === void 0 ? void 0 : value.description) !== null && _a !== void 0 ? _a : '');
            console.log('      example:', (_b = value === null || value === void 0 ? void 0 : value.example) !== null && _b !== void 0 ? _b : '');
            console.log('    ------------------');
        }
        return '';
    }
}
exports.default = explain;
