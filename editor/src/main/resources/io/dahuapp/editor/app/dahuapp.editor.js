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
        var jsonFileName = "presentation.dahu";

        /*
         * True when new button was pressed.
         * @type Boolean
         */
        var initProject = false;
        
        /**
         * True when new changes occurs
         * @type Boolean
         */
        var newChanges = false;

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
         * Current slide displayed in the view.
         * @type String
         */
        var currentSlide = null;
        
        /*
         * Private events for the editor.
         */
        var events = (function() {
            var self = {};
            
            /*
             * Creates a generic event.
             */
            var createEvent = function() {
                var callbacks = $.Callbacks();
                return {
                    publish: callbacks.fire,
                    subscribe: callbacks.add,
                    unsubscribe: callbacks.remove
                };
            };
            
            /*
             * Called when an image on the list has been selected and
             * is different from the previous one.
             */
            self.selectedImageChanged = createEvent();
            
            /*
             * Called when an image is added (by taking a screen capture).
             */
            self.newImageTaken = createEvent();
            
            /*
             * Called when a new projet is created.
             */
            self.newProjectCreated = createEvent();
            
            return self;
        })();

        /*
         * Instanciates the DahuScreencastModel class.
         */
        var jsonModel;

        /*
         * Standard message printers.
         */
        var captureModeAlert = function() {
            alert("Please turn capture mode off\n" +
                "before doing that.");
        };
        var initialiseProjectAlert = function() {
            alert("Please open or create a project\n" +
                "before doing that.");
        };
        
        /*
         * Functions associated with buttons.
         */
        var openProject = function() {
            var choice = prompt("Enter the absolute path to the dahu project directory :",
                    "Dahu project directory.");
            // projectDir = driver.askForProjectDir();
            if (choice) {
                var fileSystem = dahuapp.drivers.fileSystem;
                var sep = fileSystem.getSeparator();
                var absolutePath = choice + sep + jsonFileName;
                if (!fileSystem.exists(absolutePath)) {
                    alert("The following file :\n\n" + absolutePath +
                        "\n\ndoesn't exist. Please create a new project,\n" +
                        "or specify a valid dahu project directory.");
                    return;
                }
                projectDir = choice;
                var stringJson = fileSystem.readFile(absolutePath);
                var slideList;
                var i = 0;
                events.newProjectCreated.publish();
                jsonModel.loadJson(stringJson);
                slideList = jsonModel.getSlideList();
                while (slideList[i]) {
                    var img = slideList[i];
                    events.newImageTaken.publish(img);
                    i++;
                }
                dahuapp.drivers.setTitleProject(projectDir);
                initProject = true;
            }
        };
        var newProject = function() {
            var choice = prompt("Enter the absolute path of the project directory :",
                    "Dahu project directory.");
            // projectDir = driver.askForProjectDir();
            if (choice) {
                var fileSystem = dahuapp.drivers.fileSystem;
                if (!fileSystem.exists(choice)) {
                    if (!fileSystem.create(choice)) {
                        alert("The directory couldn't have been created.\n"
                                + "Maybe it's an issue with rights.");
                        return;
                    } else {
                        alert("The directory has been successfully created.");
                    }
                } else {
                    alert("This directory already exists.\n" +
                            "It's not a problem, but be careful !");
                }
                projectDir = choice;
                jsonModel.createPresentation();
                dahuapp.drivers.setTitleProject(projectDir);
                dahuapp.drivers.logger.JSinfo("dahuapp.editor.js", "init", "project created !");
                initProject = true;
                events.newProjectCreated.publish();
            }
        };

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
            $('#capture-mode').toggleClass('btn-danger');
            captureMode = !captureMode;
            if (captureMode) {
                dahuapp.drivers.logger.JSconfig("dahuap.editor.js", "switchCaptureMode", "capture mode on");
            } else {
                dahuapp.drivers.logger.JSconfig("dahuap.editor.js", "switchCaptureMode", "capture mode off");
            }
        };
        
        /*
         * Function to update the preview on the middle.
         * slide is the absolute path to the image
         */
        var updatePreview = function(slide) {
            if ($('#preview-image').empty()) {
                $('#preview-image').append($(document.createElement('img'))
                    .attr({'src': slide, 'alt': slide}));
            } else {
                $('#preview-image').children().replaceWith(
                    $(document.createElement('img'))
                    .attr({'src': slide, 'alt': slide}));
            }
        };
        
        /*
         * Function to update the image list (when a new one is captured).
         * img is the relative path to the image (relatively to the .dahu file)
         */
        var updateImageList = function(img) {
            var sep = dahuapp.drivers.fileSystem.getSeparator();
            $('#image-list').append($(document.createElement('li'))
                    .attr({'class': 'span2 offset'})
                    .append($(document.createElement('a'))
                            .attr({'class': 'thumbnail'})
                            .append($(document.createElement('img'))
                                    .attr({'src': projectDir + sep + img,
                                        'alt': projectDir + sep + img})
                            )
                    )
            );
            updatePreview(projectDir + sep + img);
        };
        
        /*
         * Cleans the image list.
         */
        var cleanImageList = function() {
            $('#image-list').contents().remove();
        };
        
        /*
         * Cleans the preview.
         */
        var cleanPreview = function() {
            $('#preview-image').contents().remove();
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
            // shortcuts
            var drivers = dahuapp.drivers;
            switch (drivers.keyboard.keyToString(key).toLowerCase()) {
                case "f7":
                    var img = dahuapp.drivers.screen.takeScreen(projectDir);
                    var mouse = dahuapp.drivers.mouse;
                    jsonModel.addSlide(img, mouse.getMouseX(), mouse.getMouseY());
                    events.newImageTaken.publish(img);
                    newChanges = true;
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
            /*
             * Instanciation of the JSON model
             */
            jsonModel = dahuapp.createScreencastModel();
            /*
             * Private events callbacks subscribals.
             */
            events.selectedImageChanged.subscribe(updatePreview);
            events.newImageTaken.subscribe(updateImageList);
            events.newProjectCreated.subscribe(cleanImageList);
            events.newProjectCreated.subscribe(cleanPreview);
            
            /*
             * Basic events for the buttons and components.
             */
            $('#image-list').on('click', 'img', function() {
                var imgName = $(this).attr('src');
                if (currentSlide !== imgName) {
                    currentSlide = imgName;
                    events.selectedImageChanged.publish(currentSlide);
                }
            });
            $('#capture-mode').click(function() {
                if (initProject) {
                    switchCaptureMode();
                } else {
                    initialiseProjectAlert();
                }
            });
            $('#save-project').click(function() {
                if (initProject && !captureMode) {
                    var stringJson = jsonModel.getJson();
                    var driver = dahuapp.drivers.fileSystem;
                    if (driver.writeFile(projectDir + driver.getSeparator() + jsonFileName, stringJson)) {
                        dahuapp.drivers.logger.JSinfo("dahuapp.editor.js", "init", "project saved in " + projectDir);
                        alert("The project has been saved successfully.");
                        newChanges = false;
                    } else {
                        alert("There's been a problem.\n" +
                            "The project hasn't been saved.");
                        dahuapp.drivers.logger.JSsevere("dahuapp.editor.js", "init", "failed to save project in " + projectDir);
                    }
                } else if (captureMode) {
                    captureModeAlert();
                    dahuapp.drivers.logger.JSwarning("dahuapp.editor.js", "init", "can't save a project when captureMode is on!");
                } else {
                    initialiseProjectAlert();
                    dahuapp.drivers.logger.JSwarning("dahuapp.editor.js", "init", "can't save as there is no project selected !");
                }
            });
            $('#open-project').click(function() {
                if (!captureMode) {
                    if (newChanges) {
                        var discard = confirm("There are unsaved changes.\n" +
                                "Discard them and still open a project ?");
                        if (discard) {
                            openProject();
                        }
                    } else {
                        openProject();
                    }
                } else {
                    captureModeAlert();
                    dahuapp.drivers.logger.JSwarning("dahuapp.editor.js", "init", "can't open a project when captureMode is on!");
                }
            });
            $('#new-project').click(function() {
                if (!captureMode) {
                    if (newChanges) {
                        var discard = confirm("There are unsaved changes.\n" +
                                "Discard them and still open a project ?");
                        if (discard) {
                            newProject();
                        }
                    } else {
                        newProject();
                    }
                } else {
                    captureModeAlert();
                    dahuapp.drivers.logger.JSwarning("dahuapp.editor.js", "init", "can't create a new project when captureMode is on!");
                }
            });
            $('#exit').click(function() {
                if (captureMode) {
                    captureModeAlert();
                } else {
                    var message = 'Are you sure you want to quit ?';
                    if (newChanges) {
                        message = 'Quit without saving any changes ?';
                    }
                    if (confirm(message)) {
                        dahuapp.drivers.exit();
                    }
                }
            });
            $('#generate').click(function() {
                if (captureMode) {
                    captureModeAlert();
                } else {
                    if (!initProject) {
                        initialiseProjectAlert();
                    } else {
                        alert("Not implemented yet.");
                    }
                }
            });
            $('#visual-mode').click(function() {
                if (captureMode) {
                    captureModeAlert();
                } else {
                    if (!initProject) {
                        initialiseProjectAlert();
                    } else {
                        alert("Not implemented yet.");
                    }
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