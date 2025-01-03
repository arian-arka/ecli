# Easy Node CLI

**Introduction**

An easy and high customizable cli with pre-built features.

- [Getting Started](#getting-started)
    - [Installing for node projects](#installing-for-node-projects)
    - [Installing custom commands](#installing-custom-commands)
    - [Running custom commands](#running-custom-commands)
- [Custom Command](#custom-command)
    - [Class creation](#class-creation)
        - [Method creation](#method-creation)
        - [Parameter passing](#parameter-passing)
- [Built in commands](#built-in-commands)
    - [dir](src/command/dir/README.md)
    - [file](src/command/file/README.md)
    - [json](src/command/json/README.md)
    - [solid-js](src/command/solid-js)
        - [component](src/command/solid-js/component/README.md)

## Getting Started

### Installing for node projects
````bash
> npm i https://github.com/arian-arka/ecli
````

----

### Installing custom commands
````bash
> ecli command/generate path:command
````

----

### Running custom commands
running hello command
````bash
> ecli command/run !path:command !build !command:hello
````
Every other parameters will be sent off to the custom command

<h6>!path and !build and !command parameters are only for running<h6/>

----






## Custom Command

### Class creation

In you command path, navigate to src/command and create a file named custom.ts

````ts
import {Command} from "ecli/dist/src/class/Command";
import {basePath} from "ecli/dist/src/helper/path";

export default class custom extends Command {}
````

#### Method creation
Then create a class like this that extends Command
````ts
import {Command} from "ecli/dist/src/class/Command";
import {basePath} from "ecli/dist/src/helper/path";

export default class custom extends Command{
  index(args : any): any {
    console.log('index of custom! ',args);
    console.log('base',basePath());
  }

  argsType(props : {
    arg?:any,
    arg1:boolean,
    arg2:boolean,
    arg3:string,
    arg4:number,
    arg5:number,
  }) : any{
    console.log('arg :(',props.arg,') type:',typeof props.arg);
    console.log('arg1 :(',props.arg1,') type:',typeof props.arg1);
    console.log('arg2 :(',props.arg2,') type:',typeof props.arg2);
    console.log('arg3 :(',props.arg3,') type:',typeof props.arg3);
    console.log('arg4 :(',props.arg4,') type:',typeof props.arg4);
    console.log('arg5 :(',props.arg5,') type:',typeof props.arg5);

    return 'Return Value!!';
  }
}
````

Run the following command 
````bash
> ecli command/run !path:command !build !command:custom arg1 arg2: arg3:hi arg4:12 arg5:0.123
````
Default method is index, it will be executed when no method is acquired.

and the output must be something like
```
< return >
index of custom!  { arg1: true, arg2: false, arg3: 'hi', arg4: 12, arg5: 0.123 }
base [your base path]
```

Run the following command
````bash
> ecli command/run !path:command !build !command:custom:argsType arg1 arg2: arg3:hi arg4:12 arg5:0.123
````
Method argsType will be executed

and the output must be something like
```
< return >
arg :( undefined ) type: undefined
arg1 :( true ) type: boolean
arg2 :( false ) type: boolean
arg3 :( hi ) type: string
arg4 :( 12 ) type: number
arg5 :( 0.123 ) type: number
Return Value!!
```

#### Parameter passing
Look how parameters are passed in the previous example

Parameters and values are seperated with `:`

`trueVal` is equal to 
````ts
  const trueVal : boolean = true;
````
`falseVal:` is equal to
````ts
  const trueVal : boolean = false;
````
`stringVal:abcedf123` is equal to
````ts
  const stringVal : string = 'abcedf123';
````
`numberVal:123` is equal to
````ts
  const numberVal : number = 123;
````
----

