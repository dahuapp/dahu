"use strict";

/**
 * Dahuapp editor module.
 * 
 * @param   dahuapp     dahuapp object to augment with module.
 * @param   $           jQuery
 * @returns dahuapp extended with editor module.
 */
var dahuapp = (function(dahuapp, $) { 
    var editor = (function () {
        
        var self = {};
        
        /* private API */
        
        /*
         * Tells if the app is in the capture mode (in theory, no actions are
         * available in this mode, other than clicking on the capture mode
         * button, or pressing the capture or escape keyboard keys).
         * @type Boolean
         */
        var captureMode = false;

        /*
         * Event handlers
         ****************
         * For each handler, put a function name (the same as the key for example).
         * Anonymous functions can't be called from the driver,
         * because Java7 doesn't handle JSObjects well, so it only records the name.
         */

        /*
         * Handle events relative to the capture mode.
         * Other events will be ignored.
         * @param String type Type of the event.
         */
        function handleCaptureModeEvent(type) {
            switch (type.toLowerCase()) {
                case "capture":
                    dahuapp.drivers.screen.takeScreen();
                    break;
                case "escape":
                    dahuapp.editor.exitCaptureMode();
                    break;
            }
        };

        /* public API */
        
        /*
         * Main function : by calling this function, we bind the
         * html components of the application with their behaviour.
         * So this function must be called once when the html is loaded
         * in the application window.
         */
        self.init = function init() {
            /*
             * We must remember who 'this' is, because in a jQuery statement
             * the 'this' refers to the jQuery returns and not to the
             * englobant object.
             */
            var self = this;
            
            $('#capture-mode').click(function() {
                // shortcut
                var driver = dahuapp.drivers.keyboard;
                // if we're in capture mode, we exit it, otherwise we enter it
                if (!self.captureMode) {
                    driver.addKeyCallback(handleCaptureModeEvent);
                } else {
                    driver.removeKeyCallback(handleCaptureModeEvent);
                }
                // the capture mode button gets a different style
                $('#capture-mode').toggleClass('btn-primary', 'btn-success');
                self.captureMode = !self.captureMode;
            });
        };
        
        /**
         * 
         * @param {type} args
         * @returns {String}
         */
        self.somePublicFunction = function somePublicFunction(args) {
            return "public (editor) hello "+args;
        }; 
        
        return self;
    })();
    
    dahuapp.editor = editor;

    return dahuapp;
})(dahuapp || {}, jQuery);