import { Command } from "../../class/Command";
export default class json extends Command {
    index(props: {
        src: string;
        dst: string;
        key?: string | string[];
    }): void;
}
