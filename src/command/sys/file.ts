import {ofStaticClass} from "../../class/Command";
import {File} from "../../lib/File";

const file : any = ofStaticClass(File,() => console.log('index from file!!'));
export default file;