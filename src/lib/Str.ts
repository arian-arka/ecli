import * as path from "path";
export class Str{

    static firstLower(name : string) {
        return name[0].toLowerCase() + name.substring(1);
    }
    static filename(dir : string){
        const basename = path.basename(dir);
        return basename.substring(0, basename.lastIndexOf('.'))
    }
    static random(len = 20) {
        let arr = new Uint8Array((len || 40) / 2)
        crypto.getRandomValues(arr)
        return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join('')
    }

    static randomFilename(){
        let timestamp = new Date().toISOString().replace(/[-:.]/g,"");
        let random = ("" + Math.random()).substring(2, 8);
        return  timestamp+random;
    }
}