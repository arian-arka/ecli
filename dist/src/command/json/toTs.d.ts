import { Command } from "../../class/Command";
export default class toTs extends Command {
    index(props: {
        src: string;
        dst: string;
        key?: string | string[];
    }): void;
}
