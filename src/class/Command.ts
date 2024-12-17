export abstract class Command{
    public abstract index(...args:any ) : any;
}

export function ofStaticClass(cls : any,index?:(...args:any) => any){
    function obj(){
        for(let pr of Object.getOwnPropertyNames(cls)){
            if(typeof cls[pr] === "function"){
                // @ts-ignore
                this[pr] = cls[pr];
            }
        }
        // @ts-ignore
        this['index'] = index ?? ((...args : any) => console.log(`index from ${cls.constructor.name}`,args));
    }

    return obj;
}