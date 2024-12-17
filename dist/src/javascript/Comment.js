"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
class Comment {
    static jsText(text) {
        return `/* ${text} */`;
    }
    static jsxText(text) {
        return `{/* ${text} */}`;
    }
    static jsCheck() {
        return this.jsText('check');
    }
    static jsxCheck() {
        return this.jsxText('check');
    }
    static jsImplement() {
        return this.jsText('implement');
    }
    static jsxImplement() {
        return this.jsxText('implement');
    }
}
exports.Comment = Comment;
