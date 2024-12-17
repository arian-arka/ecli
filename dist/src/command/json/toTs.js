"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const File_1 = require("../../lib/File");
const read_1 = __importDefault(require("./read"));
class toTs extends Command_1.Command {
    index(props) {
        File_1.File.create({
            path: props.dst,
            data: `export default ${JSON.stringify((new read_1.default()).index({ path: props.src }))}`,
        });
    }
}
exports.default = toTs;
