"use strict";

/**
 * Dahuapp editor module.
 * 
 * @param   dahuapp     dahuapp object to augment with module.
 * @param   $           jQuery
 * @returns dahuapp extended with editor module.
 */
var dahuapp = (function(dahuapp, $) {
    var editor = (function() {

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
         * Name of the Json file.
         * @type String
         */
        var jsonFileName = "presentation.json";

        /*
         * True when new button was pressed.
         * @type Boolean
         */
        var initProject = false;

        /*
         * The absolute path of a directory.
         * This directory has the following components (at least) :
         * projectDir
         *      |------- format.json
         *      |------- screen1.png
         *      |------- ...
         *      |------- screen2.png
         *      
         * The default value must be discussed.
         * @type String
         */
        var projectDir = ".";

        /*
         * Changes the capture mode (if true => false, if false => true).
         */
        var switchCaptureMode = function() {
            // shortcut
            var keyboardDriver = dahuapp.drivers.keyboard;
            // if we're in capture mode, we exit it, otherwise we enter it
            if (!captureMode) {
                keyboardDriver.addKeyListener(self.handleCaptureModeEvent);
            } else {
                keyboardDriver.removeKeyListener(self.handleCaptureModeEvent);
            }
            // the capture mode button gets a different style
            $('#capture-mode').toggleClass('btn-primary');
            $('#capture-mode').toggleClass('btn-success');
            captureMode = !captureMode;
        };

        /* public API */

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
         * 
         * Can be eventually set private if JSObject can be memorized by java.
         * 
         * @param int key Key that caused the event.
         */
        self.handleCaptureModeEvent = function handleCaptureModeEvent(key) {
            // shortcut
            var drivers = dahuapp.drivers;
            switch (drivers.keyboard.keyToString(key).toLowerCase()) {
                case "f7":
                    var img = dahuapp.drivers.screen.takeScreen(projectDir);
                    var mouse = dahuapp.drivers.mouse;
                    dahuapp.editor.json.addSlide(img, mouse.getMouseX(), mouse.getMouseY());
                    $('#image-list').append($(document.createElement('li'))
                            .attr({'class': 'span2 offset'})
                            .append($(document.createElement('a'))
                            .attr({'class': 'thumbnail'})
                            .append($(document.createElement('img'))
                            .attr({'src': img, 'alt': img}))));
                    $('#preview-image').replaceWith($(document.createElement('div'))
                            .attr({'id': 'preview-image'})
                            .append($(document.createElement('img'))
                            .attr({'src': img, 'alt': img})));
                    break;
                case "escape":
                    switchCaptureMode();
                    break;
            }
        };

        /*
         * Main function : by calling this function, we bind the
         * html components of the application with their behaviour.
         * So this function must be called once when the html is loaded
         * in the application window.
         */
        self.init = function init() {
            
            $('#capture-mode').click(function() {
                if (initProject) {
                    switchCaptureMode();
                }
            });
            $('#save-project').click(function() {
                if (initProject && !captureMode) {
                    var stringJson = dahuapp.editor.json.getJson();
                    var driver = dahuapp.drivers.fileSystem;
                    driver.writeFile(projectDir + driver.getSeparator() + jsonFileName, stringJson);
                }
            });
            $('#open-project').click(function() {
                if (!captureMode) {
                    var driver = dahuapp.drivers.fileSystem;
                    projectDir = driver.askForProjectDir();
                    if (projectDir) {
                        var stringJson = driver.readFile(projectDir + driver.getSeparator() + jsonFileName);
                        dahuapp.editor.json.loadJson(stringJson);
                        initProject = true;
                    }
                }
            });
            $('#new-project').click(function() {
                if (!captureMode) {
                    dahuapp.drivers.dialog.showMessage("Info",
                        "The project was successfully created.");
                    dahuapp.editor.json.createPresentation();
                    initProject = true;
                }
            });
        };
        
        /**
         * 
         * @param {type} args
         * @returns {String}
         */
        self.somePublicFunction = function somePublicFunction(args) {
            return "public (editor) hello " + args;
        };

        return self;
    })();

    dahuapp.editor = editor;

    return dahuapp;
})(dahuapp || {}, jQuery);