import { Command } from "ecli-base/dist/src/lib/command/Command";
export default class explain extends Command {
    index(args: {
        command?: string;
    }): any;
}
