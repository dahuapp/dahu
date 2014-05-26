    // define empty jquery since jquery: 'empty:' in the require.config
    // seems not to work with AlmondJS
    // @todo remove one day.
    define('jquery', function(){});

    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('dahubridge');
}));