function test(a,b,c){
    return a+b+c;
}

console.log(test(...{a:1,b:2,c:3}));