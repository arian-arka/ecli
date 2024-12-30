# FILE

[//]: # (**Introduction**)


- [Read](#read)
- [Read JSON](#read-json)
- [Write JSON](#write-json)
- [Is File](#is-file)
- [Copy](#copy)
- [Exists](#exists)
- [Create](#create)
- [Directory name of file](#directory-name-of-file)

## Read
Read a file 
````bash
> easy-node-cli file:read path:package.json
````
----
## Read JSON
Read a json file

````bash
> easy-node-cli file:readJson src:package.json
````
----
## Write JSON
Write a file
````bash
> easy-node-cli file:writeJson path:package.json "data:{key:\"value\"}"
````
----
## Is File
Check weather a given path exists and is a file
````bash
> easy-node-cli file:isFile path:package.json
````

----
## Copy
Copies source to destination
````bash
> easy-node-cli file:copy src:package.json dst:../package.json
````
----
## Exists
Check weather a given path exists
````bash
> easy-node-cli file:exists path:package.json
````
----
## Create
Creates a file
````bash
> easy-node-cli file:create path:package.json check createDir "data:{key:\"value\"}" 
````

Parameter     | Required    | Default        | Description                                  |
--------------|-------------|----------------|----------------------------------------------| 
data          |             | empty string ""|                                              |
createDir     |             | true           | creates the directories if they don't exists |

----
## Directory name of file
Returns the address of the directory that the file sits in
````bash
> easy-node-cli file:dirName src:package.json
````
