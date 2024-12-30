import { Command } from "../../../class/Command";
export default class rakutentechLaravelRequestDocs extends Command {
    index(args: {
        uri?: string;
        withController?: boolean;
        withPrefix?: string;
        withoutPrefix?: string;
        filter?: string;
    }): Promise<void>;
    private fetchData;
    private filterEndPoint;
    private toKeyValue;
}
