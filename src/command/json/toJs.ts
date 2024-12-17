import {Command} from "../../class/Command";
import {File} from "../../lib/File";
import read from "./read";

export default class toJs extends Command {
    index(props: {
        src: string,
        dst: string,
        key?: string | string[]
    }) {
        File.create({
            path: props.dst,
            data: `exports.default = ${JSON.stringify((new read()).index({path:props.src}))}`,
        })

    }
}