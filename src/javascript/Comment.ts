export class Comment{
    static jsText(text : string){
        return `/* ${text} */`;
    }
    static jsxText(text : string){
        return `{/* ${text} */}`;
    }

    static jsCheck(){
        return this.jsText('check');
    }

    static jsxCheck(){
        return this.jsxText('check');
    }

    static jsImplement(){
        return this.jsText('implement');
    }

    static jsxImplement(){
        return this.jsxText('implement');
    }
}