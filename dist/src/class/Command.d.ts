export declare abstract class Command {
    abstract index(...args: any): any;
}
export declare function ofStaticClass(cls: any, index?: (...args: any) => any): () => void;
