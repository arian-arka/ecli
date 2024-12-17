import {Command} from "../../class/Command";
import {File} from "../../lib/File";
import read from "./read";

export default class json extends Command {
    index(props: {
        src: string,
        dst: string,
        key?: string | string[]
    }) {
        File.create({
            path: props.dst,
            data: JSON.stringify((new read()).index({path:props.src})),
        })
    }
}