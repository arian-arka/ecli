"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("ecli-base/dist/src/lib/command/Command");
class hello extends Command_1.Command {
    index(args) {
        return 'heloooooooooo';
    }
}
exports.default = hello;
