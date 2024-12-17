
export default class Var {
    static isNumeric = (str: any) => typeof str !== "string" ? false : !isNaN(Number(str));

    static parseStr(str: string): null | undefined | number | boolean | string {
        const lowerStr = str.toLowerCase();
        if (lowerStr === 'true')
            return true;
        if (lowerStr === 'false')
            return false;
        if (lowerStr === 'null')
            return null;
        if (lowerStr === 'undefined')
            return undefined;
        if (Var.isNumeric(str))
            return Number(str);
        return str;
    }

}