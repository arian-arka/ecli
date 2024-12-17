import {Command, ofStaticClass} from "../../class/Command";
import {Directory} from "../../lib/File";

const dir : any = ofStaticClass(Directory,() => console.log('index from dir!!'));
export default dir;