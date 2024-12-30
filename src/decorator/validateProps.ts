import Ajv, {JSONSchemaType} from "ajv"
import assert from "node:assert";
import addFormats from "ajv-formats";

export default function validateProps<T>(schema: JSONSchemaType<T>): MethodDecorator {
    return <T>(
        target: object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>,
    ) => {
        const originalValue = descriptor.value
        // @ts-ignore
        descriptor.value = function (arg: T) {
            const ajv = new Ajv({useDefaults: true,coerceTypes:true});
            addFormats(ajv);
            const validate = ajv.compile(schema);
            const valid = validate(arg);
            if (valid) { // @ts-ignore
                return originalValue.apply(this, [arg]);
            }
            throw new Error(JSON.stringify(validate.errors?.map(e => e.message),null,2));
        };
    };
}