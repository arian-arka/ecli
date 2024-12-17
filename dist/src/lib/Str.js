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
exports.Str = void 0;
const path = __importStar(require("path"));
class Str {
    static firstLower(name) {
        return name[0].toLowerCase() + name.substring(1);
    }
    static filename(dir) {
        const basename = path.basename(dir);
        return basename.substring(0, basename.lastIndexOf('.'));
    }
    static random(len = 20) {
        let arr = new Uint8Array((len || 40) / 2);
        crypto.getRandomValues(arr);
        return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join('');
    }
    static randomFilename() {
        let timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        let random = ("" + Math.random()).substring(2, 8);
        return timestamp + random;
    }
}
exports.Str = Str;
