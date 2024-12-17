import { Command } from "../../class/Command";
export default class read extends Command {
    index(props: {
        path: string;
        key?: string | string[];
    }): any;
}
