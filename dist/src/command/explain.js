"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("ecli-base/dist/src/lib/command/Command");
const ecli_1 = require("../../ecli");
const node_assert_1 = __importDefault(require("node:assert"));
class explain extends Command_1.Command {
    index(args) {
        var _a, _b, _c;
        if (!(!!args.command))
            return '"Explain" command explains other commands';
        const [method, cls, obj] = (0, ecli_1.commandToClsAndMethod)(args.command);
        (0, node_assert_1.default)(method in ((_a = obj === null || obj === void 0 ? void 0 : obj.__terminal__) !== null && _a !== void 0 ? _a : {}), `${args.command},is not explainable`);
        const { description, paras } = obj.__terminal__[method];
        console.log('class:', obj.constructor.name);
        console.log('method:', method);
        console.log('description:', description);
        console.log('parameters:');
        for (const [key, value] of Object.entries(paras !== null && paras !== void 0 ? paras : {})) {
            console.log('   ', key, ':', (_b = value === null || value === void 0 ? void 0 : value.description) !== null && _b !== void 0 ? _b : '');
            console.log('      example:', (_c = value === null || value === void 0 ? void 0 : value.example) !== null && _c !== void 0 ? _c : '');
            console.log('    ------------------');
        }
        return '';
    }
}
exports.default = explain;
