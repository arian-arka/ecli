export declare function lookInDirective(splitted: string[], def?: string): [string, string, any];
export declare function commandToClsAndMethod(command: string, def?: string): [string, string, any];
export declare function run(command: string, args: any): Promise<{
    result: any;
    ok: boolean;
}>;
export declare function runCli(stdout?: boolean): Promise<"" | {
    result: any;
    ok: boolean;
}>;
