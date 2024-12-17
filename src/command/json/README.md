# JSON

[//]: # (**Introduction**)


- [Read](#read)
- [Read with specific keys](#read-with-specific-keys)
- [Copy](#copy)
- [Copy with specific keys](#copy-with-specific-keys)
- [To JS](#to-js)
- [To JS with specific keys](#to-js-with-specific-keys)
## Read
Read a json file 
````bash
> easy-node-cli json/read path:package.json
````
----
## Read with specific keys
Read a json file with specific keys 

````bash
> easy-node-cli json/read path:package.json key:name key:version
````
returns an object with name and version keys

----
## Copy
Copy a json file
````bash
> easy-node-cli json/copy src:package.json dst:../package.json
````
----
## Copy with specific keys
Copy a json file with specific keys
````bash
> easy-node-cli json/copy src:package.json dst:../package.json
````

copies a json file containing an object with name and version keys from the origin

----
## To JS
Convert a json file to a .js file that exports default the object containing the json file 
````bash
> easy-node-cli json/toJs src:package.json dst:package.js
````
for ts type use the following command
````bash
> easy-node-cli json/toTs src:package.json dst:package.js
````
----
## To JS with specific keys
Convert a json file to a .js file that exports default the object containing the json file with specific keys
````bash
> easy-node-cli json/toJs src:package.json dst:package.js key:name key:version
````
for ts type use the following command
````bash
> easy-node-cli json/toTs src:package.json dst:package.js key:name key:version
````

----