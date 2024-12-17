"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const File_1 = require("../../lib/File");
class read extends Command_1.Command {
    index(props) {
        let obj = File_1.File.readJson({ path: props.path });
        if (props.key) {
            if (typeof props.key === 'string' && !!props.key)
                obj = obj[props.key];
            else if (Array.isArray(props.key) && props.key.length)
                for (let k of props.key)
                    obj = obj[k];
        }
        return obj;
    }
}
exports.default = read;
