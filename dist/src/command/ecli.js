"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("ecli-base/dist/src/lib/command/Command");
class ecli extends Command_1.Command {
    index(args) {
        return 'Easy Command Line Interface';
    }
}
exports.default = ecli;
