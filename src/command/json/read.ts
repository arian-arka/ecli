import {Command} from "../../class/Command";
import {File} from "../../lib/File";

export default class read extends Command {
    index(props: {
        path: string,
        key?: string | string[]
    }): any {
        let obj: any = File.readJson({path: props.path});
        if (props.key) {
            if (typeof props.key === 'string' && !!props.key)
                obj = obj[props.key];
            else if (Array.isArray(props.key) && props.key.length)
                for (let k of props.key)
                    obj = obj[k];
        }
        return obj;
    }

}