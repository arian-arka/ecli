# Command

[//]: # (**Introduction**)


- [Generate](#generate)
- [Run](#run)



## Generate
Installs a customizable base for generating commands
````bash
> easy-node-cli command/generate path:command
````

----
## Run
Copies source to destination
````bash
> easy-node-cli command/run !path:command !build !command:hello
````
Parameter     | Required | Default | Description                   |
--------------|---------|---------|-------------------------------| 
!path         |         | command | base of customizable commands |
!command         |     ✅   |         | command to execute            |
!build         |         | true    | build the typescript with tsc |

----

