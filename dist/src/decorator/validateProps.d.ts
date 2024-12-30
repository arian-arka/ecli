import { JSONSchemaType } from "ajv";
export default function validateProps<T>(schema: JSONSchemaType<T>): MethodDecorator;
