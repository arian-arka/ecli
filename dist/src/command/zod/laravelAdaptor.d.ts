import { Command } from "../../class/Command";
export default class laravelAdaptor extends Command {
    index(args: {
        rules: {
            [key: string]: string[];
        };
        defaults?: {
            required?: boolean;
        };
    }): Promise<any>;
    private checkHasRule;
    private toObject;
}
