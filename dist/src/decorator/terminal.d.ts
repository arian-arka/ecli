export default function terminal(props: {
    description?: string;
    paras?: {
        [key: string]: {
            description: string;
            example?: string;
        };
    };
}): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
