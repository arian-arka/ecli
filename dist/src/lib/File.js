"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.Directory = void 0;
const fs = __importStar(require("fs"));
const _path = __importStar(require("path"));
class Directory {
    static exists(props) {
        return fs.existsSync(props.path);
    }
    static isDir(props) {
        return fs.existsSync(props.path) && fs.lstatSync(props.path).isDirectory();
    }
    static copy(props) {
        var _a;
        fs.cpSync(props.src, props.dst, { recursive: true, force: (_a = props === null || props === void 0 ? void 0 : props.force) !== null && _a !== void 0 ? _a : false });
    }
    static delete(props) {
        if (!Directory.exists({ path: props.path }))
            return;
        fs.rmSync(props.path, { recursive: true, force: true });
    }
    static create(props) {
        var _a;
        if ((props === null || props === void 0 ? void 0 : props.check) && Directory.exists({ path: props.path }))
            throw new Error(`Directory ${props.path} exists`);
        fs.mkdirSync(props.path, { recursive: (_a = props === null || props === void 0 ? void 0 : props.recursive) !== null && _a !== void 0 ? _a : true });
    }
    static createIfNotExists(props) {
        var _a;
        if (!Directory.exists({ path: props.path }))
            Directory.create({ path: props.path, recursive: (_a = props.recursive) !== null && _a !== void 0 ? _a : true });
    }
}
exports.Directory = Directory;
class File {
    static readJson(props) {
        return JSON.parse(fs.readFileSync(props.path).toString());
    }
    static isFile(props) {
        return fs.existsSync(props.path) && fs.lstatSync(props.path).isFile();
    }
    static read(props) {
        return fs.readFileSync(props.path).toString();
    }
    static writeJson(props) {
        return File.create({ path: props.path, data: typeof props.data === 'string' ? props.data : JSON.stringify(props.data) });
    }
    static copy(props) {
        fs.copyFileSync(props.src, props.dst);
    }
    static dirName(props) {
        return _path.resolve(props.path, '..');
    }
    static exists(props) {
        return fs.existsSync(props.path);
    }
    static create(props) {
        var _a, _b;
        if ((props === null || props === void 0 ? void 0 : props.check) && File.exists({ path: props.path }))
            throw new Error(`File ${props.path} exists`);
        ((_a = props === null || props === void 0 ? void 0 : props.createDir) !== null && _a !== void 0 ? _a : true) && Directory.createIfNotExists({ path: File.dirName({ path: props.path }) });
        const text = typeof (props === null || props === void 0 ? void 0 : props.data) === 'object' ? JSON.stringify(props.data) : `${(_b = props === null || props === void 0 ? void 0 : props.data) !== null && _b !== void 0 ? _b : ''}`;
        fs.writeFileSync(props.path, text);
    }
}
exports.File = File;
