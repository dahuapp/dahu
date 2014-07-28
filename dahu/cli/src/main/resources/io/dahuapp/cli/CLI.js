(function(context) {

// start the core
dahubridge.start();

// get arguments
var args = CLI.arguments;

if (args['--quiet']) {
    kernel.console.setLevel('OFF');
} else if (args['--verbose']) {
    kernel.console.setLevel(args['--verbosity'])
}

if (args['generate']) {
    dahubridge.generate(args['<project>'])
}

})(this);