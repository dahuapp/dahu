/**
 * Dummy compiler module
 */
define([
    'underscore',
    'handlebars',
    // modules
    'modules/kernel/SCI',
    // template
    'text!templates/layouts/presentation/screencast.html'
], function (_, Handlebars, Kernel, presentation_tpl) {

    /**
     * Compile a *screencastModel* and return the output.
     *
     * @param screencastModel Screencast model to compile.
     *
     * @returns {String} the generated content. Undefined if a problem occurred.
     */
    function compile(screencastModel) {

        var output;

        try {
            Kernel.console.info("Starting compilation...");
            var template = Handlebars.default.compile(presentation_tpl);
            output = template(
                { // context
                    screencast: screencastModel.toJSON()
                },
                { // options
                    helpers: {
                        screencastWidth: function() {
                            return screencastModel.get("settings").get('screenWidth');
                        },
                        screencastHeight: function() {
                            return screencastModel.get("settings").get('screenHeight');
                        }
                    }
                });
            Kernel.console.info("done.");
        } catch(e) {
            Kernel.console.error("Compilation failed. {}", e.stack);
        }

        return output;
    }

    return {
        compile: compile
    }
});