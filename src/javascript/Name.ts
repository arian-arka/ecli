export class Name {
    static iName(name:string,rest : string=''){
        return `I${name}${rest}`;
    }
    static cName(name:string,rest : string=''){
        return `C${name}${rest}`;
    }

}