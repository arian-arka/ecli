"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
function validateProps(schema) {
    return (target, propertyKey, descriptor) => {
        const originalValue = descriptor.value;
        // @ts-ignore
        descriptor.value = function (arg) {
            var _a;
            const ajv = new ajv_1.default({ useDefaults: true, coerceTypes: true });
            (0, ajv_formats_1.default)(ajv);
            const validate = ajv.compile(schema);
            const valid = validate(arg);
            if (valid) { // @ts-ignore
                return originalValue.apply(this, [arg]);
            }
            throw new Error(JSON.stringify((_a = validate.errors) === null || _a === void 0 ? void 0 : _a.map(e => e.message), null, 2));
        };
    };
}
exports.default = validateProps;
