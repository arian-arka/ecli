# Directory

[//]: # (**Introduction**)


- [Is Dir](#is-dir)
- [Copy](#copy)
- [Exists](#exists)
- [Delete](#delete)
- [Create](#create)
- [Create if not exists](#create-if-not-exists)



## Is Dir
Check weather a given path exists and is a directory
````bash
> easy-node-cli dir:isDir path:docs
````

----
## Copy
Copies source to destination
````bash
> easy-node-cli dir:copy src:package.json dst:../package.json force
````
Parameter     | Required | Default | Description                                    |
--------------|----------|---------|------------------------------------------------| 
force         |          | false   | forces the operation if the destination exists |

----
## Exists
Check weather a given path exists
````bash
> easy-node-cli dir:exists path:docs
````
----


## Delete
Deletes recursively a directory
````bash
> easy-node-cli dir:delete path:docs
````
----
## Create
Creates a directory

````bash
> easy-node-cli dir:create path:docs
````
Parameter     | Required    | Default | Description                                              |
--------------|-------------|---------|----------------------------------------------------------| 
check          |             | true    | throws and error if it exists                            |
recursive     |             | true    | recursively creates the directories if they don't exists |

----
## Create if not exists
Creates a directory

````bash
> easy-node-cli dir:createIfNotExists path:docs
````
Parameter     | Required    | Default | Description                                              |
--------------|-------------|---------|----------------------------------------------------------| 
recursive     |             | true    | recursively creates the directories if they don't exists |

