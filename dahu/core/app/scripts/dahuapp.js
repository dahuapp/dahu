/**
 * Created by barraq on 05/05/14.
 */
'use-strict'

require.config({
    baseUrl: 'scripts/',
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'backbone.marionette' : {
            deps : [ 'backbone', 'underscore' ],
            exports : 'Marionette'
        },
        'backbone.wreqr': {
            deps : [ 'backbone', 'underscore' ],
            exports : 'Wreqr'
        },
        'backbone.babysitter': {
            deps : [ 'backbone', 'underscore' ],
            exports : 'Babysitter'
        },
        bootstrap: {
            deps: ['jquery', 'jquery-ui']
        },
        handlebars: {
            exports: 'Handlebars'
        },
        uuid: {
            exports: 'uuid'
        },
        fit: {
            exports: 'fit'
        }
    },
    paths: {
        'text': '../components/requirejs-text/text',
        'jquery': '../components/jquery/dist/jquery',
        'jquery-ui': '../components/jqueryui/ui/jquery-ui',
        'backbone': '../components/backbone/backbone',
        'backbone.marionette' : '../components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr' : '../components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter' : '../components/backbone.babysitter/lib/backbone.babysitter',
        'underscore': '../components/underscore/underscore',
        'bootstrap': '../components/bootstrap/dist/js/bootstrap',
        'handlebars': '../components/handlebars/handlebars.amd',
        'uuid': '../components/node-uuid/uuid',
        'fit': '../components/fit.js/fit'
    }
});

// Define patcher
define('patcher', [
    'modules/patches/backbone',
    'modules/patches/backbone.marionette'
], function(
    Backbone, Marionette
) {
    return {
        patch: function() {
            Backbone.patch();
            Marionette.patch();
        }
    }
});

// Define app
define('dahuapp', [
    'patcher',
    // libraries
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'handlebars',
    // modules
    'modules/kernel/SCI',
    'modules/screencast',
    'modules/events',
    'modules/commands',
    'modules/requestResponse',
    'modules/utils/paths',
    // controllers
    'controller/screencast',
    'controller/layout',
    // models
    'models/screencast',
    'models/screen',
    'models/objects/image',
    'models/objects/mouse',
    'models/objects/tooltip',
    // collections
    'collections/screens'
], function(
    Patcher,
    $, _, Backbone, Marionette, Handlebars,
    Kernel, Screencast, events, commands, reqResponse, Paths,
    ScreencastController, LayoutController,
    ScreencastModel, ScreenModel, ImageModel, MouseModel, TooltipModel,
    ScreensCollection) {

    var screensToDelete;
    var screencastController;
    var layoutController;

    //
    // Patch JavaScript-lang and libraries
    //
    Patcher.patch();

    //
    // Application
    //

    var app = new Backbone.Marionette.Application();

    app.addRegions({
        'frame': '#frame'
    });

    /**
     * Start the application.
     */
    app.on("before:start", function(options){
        Kernel.start();
        initBackbone();
        initEvents();
        initCommands();
    });

    /**
     * Stop the application.
     */
    app.on("finalizers:after", function(option) {
        Kernel.stop();
    });

    //
    // Initializers
    //

    /**
     * Bind events to Dahu application functions.
     * Events are used to communicate between modules
     * but also as interface between Java and JavaScript.
     */
    function initEvents() {
        events.on('kernel:keyboard:keyRelease', function(keyCode, keyName) {
            onKeyRelease(keyCode, keyName);
        });
        events.on('app:workspace:tooltips:edit', function(tooltip) {
            onTooltipEdit(tooltip);
        });
    }

    /**
     * Bind commands to Dahu application functions.
     * Commands are used to communicate between modules
     * but also as interface between Java and JavaScript.
     */
    function initCommands() {
        commands.setHandler('app:createScreencast', function() {
            createScreencast();
        });
        commands.setHandler('app:loadScreencast', function() {
            loadScreencast();
        });
        commands.setHandler('app:cleanScreencast', function(){
            cleanScreencast();
        });
        commands.setHandler('app:generateScreencast', function(){
            generateScreencast();
        });
        commands.setHandler('app:previewScreencast', function(){
            previewScreencast();
        });
        commands.setHandler('app:saveScreencast', function() {
            saveScreencast();
        });
        commands.setHandler('app:startCapture', function(){
            startCapture();
        });
        commands.setHandler('app:onCaptureStop', function() {
            captureStop();
        });
    }

    /**
     * Initialize Backbone
     */
    function initBackbone() {
        // start history
        Backbone.history.start();

        // override global sync method @todo migrate to bootstrap (require to rewrite most of the function)
        Backbone.sync = function (method, model, options) {
            if (model instanceof ScreencastModel) {
                Kernel.console.debug("Sync screencast model for method {}", method);
                if( method === 'create' ) {
                    Kernel.module('filesystem').writeToFile(
                        model.getProjectFilename(),
                        model.stringify(
                            null,  // no replacer
                            4      // 4 spaces for indentation
                        )
                    );
                }
                //@todo handle other methods
            } else {
                Kernel.console.debug("ignore sync for method {} on model {}", method, JSON.stringify(model));
            }
        };
    }

    //
    // Private API
    //

    /**
     * Load an existing Dahu Screencast project.
     * This prompts the user to select a .dahu file.
     */
    function loadScreencast() {
        // ask user for project
        var projectFilename = Kernel.module('filesystem').getFileFromUser("Open Dahu Project", "dahuProjectFile");

        // return if no given
        if( projectFilename == null ) {
            return;
        }

        // load the screencast project
        screencastController = new ScreencastController();
        screencastController.load(projectFilename);

        // create the layout
        layoutController = new LayoutController({screencast: screencastController.screencast});
        layoutController.createAndShow(app.frame);
        layoutController.showFirstScreen();
    }

    /**
     * Create a new Dahu screencast project.
     * This prompts the user to select a directory destination.
     */
    function createScreencast() {
        // ask user for project destination
        var projectDirectoryName = Kernel.module('filesystem').getDirectoryFromUser("Select the directory to store the new Dahu Project");

        // return if no given
        if( projectDirectoryName == null ) {
            return;
        }

        // calculate the path of the .dahu file to create
        var projectFilename = Screencast.getScreencastFilenameFromDirectory(projectDirectoryName);

        // test if the file exists, return if true
        if (Kernel.module('filesystem').exists(projectFilename)) {
            //@todo throw an exception to the user!
            return;
        }

        // load the screencast project
        screencastController = new ScreencastController();
        screencastController.create(projectFilename);

        // create the initial layout
        layoutController = new LayoutController({screencast: screencastController.screencast});
        layoutController.createAndShow(app.frame);
        layoutController.showFirstScreen();
    }

    /*
    * Save the current project
     */
    function saveScreencast(){
        screencastController.screencast.save();
    }

    /*
     * Start capture mode
     */
    function startCapture() {
        //Start listening to the keyboard events
        Kernel.module('keyboard').start();
        Kernel.module('keyboard').addKeyListener("kernel:keyboard:keyRelease");
    }

    /**
     * Stop capture mode
     * use for debug to take a screenshot while keyboard not implemented
     */
    function captureStop() {
        //Stop listening to the keyboard events
        Kernel.module('keyboard').removeKeyListener("kernel:keyboard:keyRelease");
        Kernel.module('keyboard').stop();
    }


    /**
     * Handle the key release event.
     * @param keyCode : the code of the pressed key
     * @param keyName : the name of the pressed key
     */
    function onKeyRelease(keyCode, keyName) {
        // we start initially with a fixed screenshot keyName.
        //@todo Make this more dynamic and flexible.
        if (keyName == 'F7') {
            takeCapture();
        }
        // capture the escape button to stop the capture mode
        if (keyCode == '27') {
            captureStop();
        }
        // delete the selected screenshot
        //@todo make this possible outside the capture mode
        if (keyCode == '8') {
            deleteSelectedScreen();
        }
    }

    /**
     * Take a screen capture and add it to the
     * screencast model.
     *
     * @todo cleanup and move part in {Screencast,Layout}Controller and ScreencastModel
     */
    function takeCapture() {
        // create new models
        var screen = new ScreenModel();
        var image = new ImageModel();
        var mouse = new MouseModel();
        var imgDir = screencastController.screencast.getImagesDirectoryAbsPath();
        // test if the image directory exists, if not create it
        if (!Kernel.module('filesystem').exists(imgDir)) {
            Kernel.module('filesystem').mkdir(imgDir);
        }
        // take the screenshot
        var capture = Kernel.module('media').takeCapture(imgDir, image.get('id'));
        // set the img path in image
        image.set('img', screencastController.screencast.getImageRelPathFor(capture.screen));
        // set the coordinates of the mouse cursor
        mouse.set('posx', capture.getMouseX());
        mouse.set('posy', capture.getMouseY());
        // Insert objects in the screen
        screen.get('objects').add(image);
        screen.get('objects').add(mouse);
        // Insert the screen in the screencast
        screencastController.screencast.model.addScreen(screen);
        // Insert the dimension of the screencast 
        // if it is the first
        if (screencastController.screencast.model.getScreenWidth() == 0) {
            screencastController.screencast.model.setScreenWidth(capture.screenSize.getWidth());
            screencastController.screencast.model.setScreenHeight(capture.screenSize.getHeight());
        };
        // Refresh the workspace
        onScreenSelect(screen);
    }

    /**
     * Delete the selected screenshot.
     *
     * @todo cleanup and move part in {Screencast,Layout}Controller and ScreencastModel.
     */
    function deleteSelectedScreen() {
        var screencastModel = screencastController.screencast.model();
        var currentScreen = layoutController.getActiveScreen();
        var id = screencastModel.get('screens').indexOf(currentScreen);
        var nbOfScreens = screencastModel.get('screens').size();
        // delete screen model
        currentScreen = screencastModel.get('screens').remove(currentScreen);
        // put the picture file on a wait to delete list
        if (screensToDelete == undefined) {
            screensToDelete = new ScreensCollection();
        }
        screensToDelete.add(currentScreen);

        // select the next screen to show in the workspace
        if (id == nbOfScreens -1) {
            id --;
        }
        onScreenSelect(screencastModel.get('screens').at(id));
    }

    /**
     * Launch the browser to preview the screencast.
     */
    function previewScreencast(){
        var path = screencastController.screencast.getGeneratedScreencastPreviewAbsPath();
        Kernel.module('browser').runPreview(path);
    }

    /**
     * Clean the build directory of the current screencast.
     */
    function cleanScreencast(){
        screencastController.screencast.clean();
    }

    /**
     * Generate the presentation in the build directory from the current screencast.
     */
    function generateScreencast(){
        screencastController.screencast.generate();
    }

    /**
     * Return the exported API.
     * All functions returned here will be
     * accessible from the browser and Java side.
     */
    return {
        // public start function
        start: function() { app.start(); },

        // we don't use app.event but our global events/commands module
        events: events,
        commands: commands,

        // public stop function
        stop: function() { app.trigger("finalizers:after"); }

    }
});
