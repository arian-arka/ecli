export default function terminal(props:{
    description?: string,
    paras?:{
        [key : string] : {
            description : string,
            example?: string
        },
    },
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if(!('__terminal__' in target))
            target.__terminal__ = {[propertyKey] : props};
        else
            target.__terminal__[propertyKey] = props;
    };
}