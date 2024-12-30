"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const path_1 = require("../../helper/path");
class hello extends Command_1.Command {
    index(args) {
        console.log('index of hello! ', args);
        console.log('base', (0, path_1.basePath)());
        return 'return from index';
    }
}
exports.default = hello;
