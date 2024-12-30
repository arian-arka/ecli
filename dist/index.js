"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runCommand_1 = require("./src/helper/runCommand");
(async () => {
    var _a;
    console.log((_a = await (0, runCommand_1.runCli)()) !== null && _a !== void 0 ? _a : '');
})();
