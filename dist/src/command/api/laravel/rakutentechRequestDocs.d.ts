import { Command } from "../../../class/Command";
export default class rakutentechRequestDocs extends Command {
    index(args: {
        uri?: string;
        withController?: boolean;
        withPrefix?: string;
        withoutPrefix?: string;
        filter?: string;
        out?: string;
    }): Promise<void>;
    private fetchData;
    private filterEndPoint;
    private toKeyValue;
}
