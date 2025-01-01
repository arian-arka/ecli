"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinPaths = exports.basePath = exports.moduleBasePath = void 0;
const node_path_1 = __importDefault(require("node:path"));
function moduleBasePath() {
    var _a;
    return (_a = require.main) === null || _a === void 0 ? void 0 : _a.path;
}
exports.moduleBasePath = moduleBasePath;
function basePath(...args) {
    const module = moduleBasePath();
    const base = !!module ? module + '/../../' : './';
    return node_path_1.default.resolve(base, ...args);
}
exports.basePath = basePath;
function joinPaths(...args) {
    return node_path_1.default.join(...args);
}
exports.joinPaths = joinPaths;
