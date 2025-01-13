"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("ecli-base/dist/src/lib/command/Command");
const path_1 = require("ecli-base/dist/src/lib/helper/path");
const node_assert_1 = __importDefault(require("node:assert"));
const Directory_1 = __importDefault(require("ecli-base/dist/src/lib/sys/Directory"));
const File_1 = __importDefault(require("ecli-base/dist/src/lib/sys/File"));
const terminal_1 = __importDefault(require("ecli-base/dist/src/decorator/terminal"));
const validateProps_1 = __importDefault(require("ecli-base/dist/src/decorator/validateProps"));
class alias extends Command_1.Command {
    index(args) {
        var _a;
        const directivePath = (0, path_1.basePath)('custom-directive', args.name);
        (0, node_assert_1.default)(args.force || !Directory_1.default.exists({ path: directivePath }), 'Already exists. use force:true');
        Directory_1.default.delete({ path: directivePath });
        Directory_1.default.create({ path: directivePath });
        File_1.default.writeJson({
            path: (0, path_1.joinPaths)(directivePath, 'directive.json'),
            data: {
                name: args.name,
                base: args.cwd === false ? args.base : (0, path_1.joinPaths)(process.cwd(), (_a = args.base) !== null && _a !== void 0 ? _a : ''),
                commands: args.commands,
                build: args.build,
            },
        });
        return true;
    }
}
exports.default = alias;
__decorate([
    (0, terminal_1.default)({
        description: 'Generate Alias for bunch of custom command written by you in any project written in js ',
        paras: {
            force: {
                description: "Force the process if it has been registered before - default is false",
                example: "force:true"
            },
            cwd: {
                description: "Append the current directory to the base - default is true",
                example: "cwd:false"
            },
            build: {
                description: "Runs the command in the base directory provided by you - default is null",
                example: "npm run build"
            },
            name: {
                description: "Your command is acknowledged by this name",
                example: "name:generator"
            },
            base: {
                description: "Your project base - default is ./",
                example: "base:../src"
            },
            commands: {
                description: "Where your commands directory is inside your base. Note that you should provide the compiled typescript directory if your are using typescript.",
                example: "commands:./dist/src/commands"
            },
        }
    }),
    (0, validateProps_1.default)({
        type: "object",
        properties: {
            force: {
                type: "boolean",
                nullable: true,
                default: false,
            },
            build: {
                type: "string",
                nullable: true,
                default: null,
            },
            cwd: {
                type: "boolean",
                nullable: true,
                default: true,
            },
            name: {
                type: "string",
            },
            base: {
                type: "string",
                nullable: true,
                default: './'
            },
            commands: {
                type: "string",
            },
        },
        required: [
            'name',
            'commands'
        ],
        additionalProperties: false
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], alias.prototype, "index", null);
