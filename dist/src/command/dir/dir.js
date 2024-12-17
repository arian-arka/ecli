"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const File_1 = require("../../lib/File");
const dir = (0, Command_1.ofStaticClass)(File_1.Directory, () => console.log('index from dir!!'));
exports.default = dir;
