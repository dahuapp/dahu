// start the core
dahubridge.start();

// get arguments
var arguments = CLI.arguments;

if (arguments['generate']) {
    dahubridge.generate(arguments['<project>'])
}