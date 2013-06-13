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
         * Name of the files used in a project.
         * @type String|String|String|String|String|String
         */
        var jsonFileName = "presentation.dahu";
        var generatedHtmlName = "presentation.html";
        var generatedJsonName = "presentation.json";
        var buildDir = "build";
        var imgDir = "img";

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
         *      |------- presentation.dahu
         *      |------- screen1.png
         *      |------- ...
         *      |------- screen2.png
         *      |------- build
         *                  |--------- presentation.dahu
         *                  |--------- screen1.png
         *                  |--------- ...
         *                  |--------- screen2.png
         *                  |--------- presentation.html
         *                  |--------- presentation.css
         *      
         * The default value must be discussed.
         * @type String
         */
        var projectDir = ".";
        
                /*
         * 
         * @type @exp;dahuapp@pro;drivers@pro;fileSystem@call;getSeparator
         */
        //var sep = dahuapp.drivers.fileSystem.getSeparator();
        
        /*
         * The default value must be discussed.
         * @type String img directory in the project
         */
        /*var ressourceImgDir = projectDir + sep + "resources" + sep
                    + "io" + sep + "dahuapp" + sep + "editor"
                    + sep + "app" + sep + "img";
        */
        /*
         * 
         * @type String name of the cursor image
         */
        var cursorImage = "cursor.png";
        
        /*
         * Current slide displayed in the view.
         * @type int
         */
        var currentSlide = -1;
        
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
            self.onSelectedImageChanged = createEvent();
            
            /*
             * Called when an image is added (by taking a screen capture).
             */
            self.onNewImageTaken = createEvent();
            
            /*
             * Called when a new projet is created.
             */
            self.onNewProjectCreated = createEvent();
            
            return self;
        })();

        /*
         * Instanciates the DahuScreencastModel class.
         */
        var jsonModel;
        
        /*
         * Instanciates the DahuScreencastGenerator class.
         */
        var generator;

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
                var absolutePath = choice + fileSystem.getSeparator() + jsonFileName;
                if (!fileSystem.exists(absolutePath)) {
                    alert("The following file :\n\n" + absolutePath +
                        "\n\ndoesn't exist. Please create a new project,\n" +
                        "or specify a valid dahu project directory.");
                    return;
                }
                projectDir = choice;
                var stringJson = fileSystem.readFile(absolutePath);
                events.onNewProjectCreated.publish();
                jsonModel.loadJson(stringJson);
                var nbSlides = jsonModel.getNbSlide();
                for (var i = 0; i < nbSlides; i++) {
                    events.onNewImageTaken.publish(i);
                }
                currentSlide = nbSlides - 1;
                dahuapp.drivers.setTitleProject(projectDir);
                initProject = true;
                newChanges = false;
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
                        setStateBarMessage("Project " + choice + " created");
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
                newChanges = false;
                events.onNewProjectCreated.publish();
            }
        };
        var cleanProjectDirectory = function() {
            var fileSystem = dahuapp.drivers.fileSystem;
            var completeBuildDir = projectDir + fileSystem.getSeparator() + buildDir;
            if (fileSystem.exists(completeBuildDir)) {
                if (!fileSystem.remove(completeBuildDir)) {
                    alert("Error, the build directory couldn't\n" +
                            "have been removed.");
                    return;
                }
            }
        };
        var generateProject = function() {
            var fileSystem = dahuapp.drivers.fileSystem;
            var sep = fileSystem.getSeparator();
            var completeBuildDir = projectDir + sep + buildDir;
            if (!fileSystem.create(completeBuildDir)) {
                alert("Error, the build directory couldn't\n" +
                        "have been created.");
                return;
            }
            var htmlGen = generator.generateHtmlString(jsonModel);
            var jsonGen = generator.generateJsonString(jsonModel);
            // write the generated json and html
            fileSystem.writeFile(completeBuildDir + sep + generatedHtmlName, htmlGen);
            fileSystem.writeFile(completeBuildDir + sep + generatedJsonName, jsonGen);
            // create img directory and adds the final forms of the images
            fileSystem.create(completeBuildDir + sep + imgDir);
            fileSystem.copyDirectoryContent(projectDir + sep + imgDir, completeBuildDir + sep + imgDir);
            // copies the script files into the build directory
            fileSystem.copyFile(fileSystem.getResource("dahuapp.viewer.js"), completeBuildDir + sep + "dahuapp.viewer.js");
            fileSystem.copyFile(fileSystem.getResource("dahuapp.viewer.css"), completeBuildDir + sep + "dahuapp.viewer.css");
            fileSystem.copyFile(fileSystem.getResource("dahuapp.js"), completeBuildDir + sep + "dahuapp.js");
        };
        var runPreview = function() {
            var sep = dahuapp.drivers.fileSystem.getSeparator();
            var target = projectDir + sep + buildDir + sep + generatedHtmlName;
            dahuapp.drivers.preview.runPreview(target);
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
                setStateBarMessage("Capture mode ON (F7 to take a screenshot / ESC to exit capture mode)");
            } else {
                keyboardDriver.removeKeyListener(self.handleCaptureModeEvent);
                setStateBarMessage("Capture mode OFF");
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
         */
        var updatePreview = function(idSlide) {
            var img = jsonModel.getSlide(idSlide).object[0].img;
            var sep = dahuapp.drivers.fileSystem.getSeparator();
            var abs = projectDir + sep + img;
            cleanPreview();
            $('#preview-image').append($(document.createElement('img'))
                    .attr({'src': abs, 'alt': abs}));
            
            // BEGINNING TO SET THE SOURIS
            /*
            var sep = dahuapp.drivers.fileSystem.getSeparator();
            var ressourceImgDir = dahuapp.drivers.rootDirectory.getRootDirectory() + sep + dahuapp.drivers.rootDirectory.getImgPath();
            
            var image = document.getElementById("preview-image");
            var imageRect = image.getBoundingClientRect();
            var jsObject = jsonModel.getSlide(id);
            var left = Math.floor((imageRect.width * jsObject.object[1].mouseX ) + imageRect.left);
            var top = Math.floor((imageRect.height * jsObject.object[1].mouseY ) + imageRect.top);
            
            // Be careful, properties down there are no CSS but HTML !
            // CSS properties must be set in dahuapp.css !
            $('#preview-image').append(
                $(document.createElement('img'))
                    .attr({'src': sep + ressourceImgDir + sep + cursorImage,
                           'alt': sep + ressourceImgDir + sep + cursorImage,
                           'position': "absolute", // strange
                           'left': left + "px", // strange
                           'top': top + "px", // strange
                           'width': "22px", // strange
                           'height': "22px", // strange
                           'z-index': 2 // strange
                       }));
                       alert(imageRect.width + "x" + imageRect.height)
           dahuapp.drivers.logger.JSsevere($('html').html());*/
        };
        
        /*
         * Function to update the image list (when a new one is captured).
         * img is the relative path to the image (relatively to the .dahu file)
         */
        var updateImageList = function(idSlide) {
            var img = jsonModel.getSlide(idSlide).object[0].img;
            var sep = dahuapp.drivers.fileSystem.getSeparator();
            var abs = projectDir + sep + img;
            $('#image-list').append($(document.createElement('li'))
                    .attr({'class': 'span2 offset'})
                    .append($(document.createElement('a'))
                            .attr({'class': 'thumbnail'})
                            .append($(document.createElement('img'))
                                    .attr({'src': abs, 'alt': abs})
                            )
                    )
            );
        };
        
        /*
         * Sets an element as selected in the image list.
         * 'selected-image' is a class in case we want to allow
         * multiple selection in a future version of the application.
         */
        var setSelectedOnImageList = function(idSlide) {
            $('#image-list > li').removeClass('selected-image');
            var selectedItem = $('#image-list > li').get(idSlide);
            $(selectedItem).addClass('selected-image');
        };
        
        /*
         * Sets the message in the state bar.
         * @param String message to display in the state bar.
         */
        var setStateBarMessage = function(message) {
            removeStateBarMessage();
            $('#state-bar-container').append(message);
        };

        /*
         * Removes the message in the state bar.
         */
        var removeStateBarMessage = function() {
            $('#state-bar-container').contents().remove();
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
                    var fileSystem = dahuapp.drivers.fileSystem;
                    var sep = fileSystem.getSeparator();
                    // creation of imgDir if it doesn't exist
                    var imgDirAbsolute = projectDir + sep + imgDir;
                    if (!fileSystem.exists(imgDirAbsolute)) {
                        if (!fileSystem.create(imgDirAbsolute)) {
                            alert("Impossible to create image directory.");
                            return;
                        }
                    }
                    var img = dahuapp.drivers.screen.takeScreen(imgDirAbsolute);
                    var imgRelative = imgDir + sep + img;
                    var mouse = dahuapp.drivers.mouse;
                    var numSlide = jsonModel.addSlide(imgRelative, mouse.getMouseX(), mouse.getMouseY());
                    events.onNewImageTaken.publish(numSlide);
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
             * Instanciation of the JSON model and the generator.
             */
            jsonModel = dahuapp.createScreencastModel();
            generator = dahuapp.createScreencastGenerator();
            
            /*
             * Private events callbacks subscribals.
             */
            events.onSelectedImageChanged.subscribe(updatePreview);
            events.onSelectedImageChanged.subscribe(setSelectedOnImageList);
            events.onNewImageTaken.subscribe(updateImageList);
            events.onNewImageTaken.subscribe(updatePreview);
            events.onNewProjectCreated.subscribe(cleanImageList);
            events.onNewProjectCreated.subscribe(cleanPreview);
            
            /*
             * Basic events for the buttons and components.
             */
            $('body').on('dragstart drop', function() {
                // - This function is to avoid exceptions when dragging elements
                //   on the webview (e.g. the preview or the images on the list).
                //   The webview doesn't support image dragging, so we desactivate
                //   it in the whole page.
                // - If a drag & drop system have to be implemented, this event
                //   will probably have to be removed.
                return false;
            });
            $('#image-list').on('click', 'li', function() {
                var imgId = $(this).index();
                if (currentSlide !== imgId) {
                    currentSlide = imgId;
                    events.onSelectedImageChanged.publish(currentSlide);
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
                    var fileSystem = dahuapp.drivers.fileSystem;
                    var sep = fileSystem.getSeparator();
                    if (fileSystem.writeFile(projectDir + sep + jsonFileName, stringJson)) {
                        dahuapp.drivers.logger.JSinfo("dahuapp.editor.js", "init", "project saved in " + projectDir);
                        setStateBarMessage("Saved in " + projectDir + " successfully");
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
            $('#clean-project').click(function() {
                if (captureMode) {
                    captureModeAlert();
                } else {
                    if (!initProject) {
                        initialiseProjectAlert();
                    } else {
                        cleanProjectDirectory();
                        setStateBarMessage("Build directory cleaned");
                    }
                }
            });
            $('#generate').click(function() {
                if (captureMode) {
                    captureModeAlert();
                } else {
                    if (!initProject) {
                        initialiseProjectAlert();
                    } else if (newChanges) {
                        alert('Please save your project before generating it.');
                    } else {
                        cleanProjectDirectory();
                        generateProject();
                        setStateBarMessage("Project successfully built");
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
                        cleanProjectDirectory();
                        generateProject();
                        runPreview();
                    }
                }
            });
        };

        return self;
    })();

    dahuapp.editor = editor;

    return dahuapp;
})(dahuapp || {}, jQuery);