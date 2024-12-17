import {Command} from "../../class/Command";
import {basePath} from "../../helper/path";

export default class nest1 extends Command{
   index(args : any): any {
       console.log('index of hello! ',args);
       console.log('base',basePath());
       return 'return from nest1';
   }
}