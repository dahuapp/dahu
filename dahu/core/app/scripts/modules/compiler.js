/**
 * Dummy compiler module
 */
define([
    'underscore',
    'handlebars',
    'modules/kernel/SCI',
    'models/screencast'
], function (_, Handlebars, Kernel, ScreencastModel) {

    function compile(data) {
        Kernel.console.info("Starting compilation...");

        // compile dahu here

        Kernel.console.info("Compilation done!");
    }

    // demo functions, @todo to remove

    function hello(who) {
        var template = Handlebars.default.compile("hello {{who}} from Handlebars!");
        return template({who: who})
    }

    function createScreencast(data) {
        return new ScreencastModel(data)
    }

    return {
        compile: compile,

        // @todo remove this, this is only a sample
        hello: hello,
        createScreencast: createScreencast
    }
});