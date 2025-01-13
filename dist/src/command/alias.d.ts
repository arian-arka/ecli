import { Command } from "ecli-base/dist/src/lib/command/Command";
export default class alias extends Command {
    index(args: {
        force?: boolean;
        cwd?: boolean;
        build?: string;
        name: string;
        base?: string;
        commands: string;
    }): any;
}
