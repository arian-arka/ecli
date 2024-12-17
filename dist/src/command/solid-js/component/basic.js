"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../../class/Command");
const File_1 = require("../../../lib/File");
class basic extends Command_1.Command {
    index() { console.log('index from basic!.'); }
    tsx(props) {
        var _a, _b;
        const name = (_a = props.name.split('/').pop()) !== null && _a !== void 0 ? _a : '';
        const data = `import type {Component} from 'solid-js';

export type C${name} = {
    children?: any
};
const ${name}: Component<C${name}> = (props) => {
    return (
        <>
            {props.children}
        </>
    );
};

export default ${name};
`;
        File_1.File.create({
            path: `${props.name}.tsx`,
            check: (_b = props === null || props === void 0 ? void 0 : props.force) !== null && _b !== void 0 ? _b : true,
            data
        });
    }
}
exports.default = basic;
