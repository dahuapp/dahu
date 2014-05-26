// start the core
dahubridge.start();

// get arguments
var arguments = CLI.arguments;

// do some stuff
for(var propertyName in dahubridge) {
    kernel.console.log("dahubridge has property {}", propertyName);
}

// do some other stuff
kernel.console.log(dahubridge.hello("dahu"));