"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const File_1 = require("../../lib/File");
const file = (0, Command_1.ofStaticClass)(File_1.File, () => console.log('index from file!!'));
exports.default = file;
