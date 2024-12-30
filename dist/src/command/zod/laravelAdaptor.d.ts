import { Command } from "../../class/Command";
export default class laravelAdaptor extends Command {
    index(args: {
        rules: Record<string, string[]>;
    }): Promise<void>;
}
