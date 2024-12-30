import {runCli} from "./src/helper/runCommand";
(async () => {
    console.log(await runCli() ?? '');
})()
