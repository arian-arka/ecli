import { Command } from "../../class/Command";
export default class toJs extends Command {
    index(props: {
        src: string;
        dst: string;
        key?: string | string[];
    }): void;
}
