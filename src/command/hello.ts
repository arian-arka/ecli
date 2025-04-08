import {Command} from "ecli-base/dist/src/lib/command/Command";
import {basePath} from "ecli-base/dist/src/lib/helper/path";

export default class hello extends Command{
   async index(args : any) {
           console.log('$require',require.main);
           return 'heloooooooooo';
   }
}
