"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const path_1 = require("../../helper/path");
class nest1 extends Command_1.Command {
    index(args) {
        console.log('index of hello! ', args);
        console.log('base', (0, path_1.basePath)());
        return 'return from nest1';
    }
}
exports.default = nest1;
