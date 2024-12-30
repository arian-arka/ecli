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
const Command_1 = require("../../class/Command");
const terminal_1 = __importDefault(require("../../decorator/terminal"));
const validateProps_1 = __importDefault(require("../../decorator/validateProps"));
class laravelAdaptor extends Command_1.Command {
    async index(args) {
    }
}
exports.default = laravelAdaptor;
__decorate([
    (0, terminal_1.default)({
        description: 'Converts laravel validation rules to zod validation and generated types',
        paras: {
            rules: {
                description: "json rules in the format of {[key:string] : string[]} ",
                example: '{"firstname":["required","string"]}'
            },
        }
    }),
    (0, validateProps_1.default)({
        type: "object",
        properties: {
            rules: {
                type: "object",
                additionalProperties: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        },
        required: ["rules"],
        additionalProperties: false
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], laravelAdaptor.prototype, "index", null);
