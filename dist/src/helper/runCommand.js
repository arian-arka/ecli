"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = exports.run = exports.commandToClsAndMethod = void 0;
const Args_1 = require("../lib/Args");
const File_1 = require("../lib/File");
const node_assert_1 = __importDefault(require("node:assert"));
function commandToClsAndMethod(command, def = 'default') {
    const splitted = command.split('.');
    let method = 'index', path = '../command/';
    if (File_1.File.isFile({ path: './src/command/' + splitted.join('/') + '.ts' })) {
        path += splitted.join('/');
    }
    else {
        (0, node_assert_1.default)(splitted.length > 1, 'Invalid command');
        method = splitted[splitted.length - 1];
        path += splitted.slice(0, splitted.length - 1).join('/');
    }
    const cls = require(path)[def];
    return [method, cls, new cls];
}
exports.commandToClsAndMethod = commandToClsAndMethod;
async function run(command, args) {
    const [method, cls, obj] = commandToClsAndMethod(command);
    return await obj[method](args);
}
exports.run = run;
async function runCli() {
    if (!Args_1.command)
        return '';
    return await run(Args_1.command, Args_1.args);
}
exports.runCli = runCli;
