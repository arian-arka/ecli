export default class Args {
    private readonly data;
    constructor(data: unknown);
    convertArg(str: string): null | undefined | number | boolean | string | object;
    private parseArg;
    make(): object;
    static parse(data: unknown): object;
    static parseProcess(): object;
    static parseProcessAsCommand(): {
        command?: string;
        args: object;
    };
}
export declare const command: string | undefined, args: object;
