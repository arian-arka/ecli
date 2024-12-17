"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = exports.run = void 0;
const Args_1 = require("../lib/Args");
const File_1 = require("../lib/File");
function run(command, args) {
    const [cls, method] = command.split('.');
    let path = '../command/' + cls;
    if (File_1.Directory.isDir({ path: './src/command/' + cls }))
        path += `/${cls}`;
    const obj = new (require(path).default);
    return obj[!!method ? method : 'index'](args);
}
exports.run = run;
function runCli() {
    if (!Args_1.command)
        return '';
    return run(Args_1.command, Args_1.args);
}
exports.runCli = runCli;
