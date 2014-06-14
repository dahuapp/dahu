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
            deps: ['jquery']
        },
        handlebars: {
            exports: 'Handlebars'
        },
        uuid: {
            exports: 'uuid'
        }
    },
    paths: {
        text: '../components/requirejs-text/text',
        jquery: '../components/jquery/dist/jquery',
        backbone: '../components/backbone/backbone',
        'backbone.marionette' : '../components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr' : '../components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter' : '../components/backbone.babysitter/lib/backbone.babysitter',
        underscore: '../components/underscore/underscore',
        bootstrap: '../components/sass-bootstrap/dist/js/bootstrap',
        handlebars: '../components/handlebars/handlebars.amd',
        uuid: '../components/node-uuid/uuid'
    }
});

// Define app
define('dahuapp', [
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'handlebars',
    // modules
    'modules/kernel/SCI',
    'modules/events',
    'modules/requestResponse',
    'modules/utils/paths',
    // controllers
    'controller/screencast',
    'controller/workspaceLayout',
    // models
    'models/screencast',
    'models/screen',
    'models/objects/image',
    'models/objects/mouse',
    'models/objects/tooltip',
    // collections
    'collections/screens',
    // layouts
    'layouts/dahuapp',
    'layouts/workspace',
    // views
    'views/filmstrip/screens'
], function($, _, Backbone, Marionette, Handlebars,
    Kernel, events, reqResponse, Paths,
    ScreencastController, WorkspaceLayoutController,
    ScreencastModel, ScreenModel, ImageModel, MouseModel, TooltipModel,
    ScreensCollection,
    DahuLayout, WorkspaceLayout,
    FilmstripScreensView) {

    var workspaceScreen;
    var screensToDelete;
    var screencastController;
    var workspaceLayoutController;

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
    app.on("initialize:before", function(options){
        Kernel.start();
        initBackbone();
        initEvent();
        initController();
        initRequestResponse();
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
    function initEvent() {
        events.on('app:onFileCreate', function() {
            onFileCreate();
        })
        events.on('app:onFileOpen', function() {
            onFileOpen();
        });
        events.on('app:filmstrip:onScreenSelected', function(screen) {
            onScreenSelect(screen);
        });
        events.on('app:onClean', function(){
            onClean();
        });
        events.on('app:onGenerate', function(){
            onGenerate();
        });
        events.on('app:onPreview', function(){
            onPreview();
        });
        events.on('app:onProjectSave', function() {
            onProjectSave();
        });
        events.on('app:onCaptureStart', function(){
            onCaptureStart();
        });
        events.on('app:onCaptureStop', function() {
            onCaptureStop();
        });
        events.on('kernel:keyboard:onKeyRelease', function(keyCode, keyName) {
            onKeyRelease(keyCode, keyName);
        });
        events.on('app:workspace:tooltips:new', function() {
            onTooltipAdd();
        });
        events.on('app:workspace:tooltips:edit', function(tooltip) {
            onTooltipEdit(tooltip);
        });
        //@todo add other events
    }

    /**
     * Initializes the project controllers
     */
    function initController() {
        screencastController = new ScreencastController();
        workspaceLayoutController = new WorkspaceLayoutController();
    }

    /**
     * Bind Requests to Specified functions.
     * Requests are used to answer some common
     * questions that modules can need.
     */
    function initRequestResponse() {
        // Prepare a response that gives the project screencast controller
        reqResponse.setHandler("app:screencast:controller", function(){
            return screencastController;
        });
        // Prepare a response that gives the workspace layout controller
        reqResponse.setHandler("app:workspace:layout:controller", function(){
            return workspaceLayoutController;
        });
    }

    /**
     * Initialize Backbone
     */
    function initBackbone() {
        // start history
        Backbone.history.start();

        // override global sync method
        Backbone.sync = function (method, model, options) {
            if (model instanceof ScreencastModel) {
                Kernel.console.debug("Sync screencast model for method {}", method);
                if( method === 'create' ) {
                    // define the indentation value to write the updated dahu file
                    var indentation = 4;
                    Kernel.console.log(model.toJSON(indentation));
                    Kernel.module('filesystem').writeToFile(screencastController.getProjectFilename(), model.toJSON(indentation));
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
     * Open a Dahu project file.
     * This prompts the user to select a .dahu file.
     */
    function onFileOpen() {
        // ask user for project
        var projectFilename = Kernel.module('filesystem').getFileFromUser("Open Dahu Project", "dahuProjectFile");

        // return if no given
        if( projectFilename == null ) {
            return;
        }

        // load the screencast project
        screencastController.load(projectFilename);

        // create the layout
        createLayout();
    }

    /**
     * Create a Dahu project file.
     * This prompts the user to select a directory destination.
     */
    function onFileCreate() {
        // ask user for project destination
        var projectDirectoryName = Kernel.module('filesystem').getDirectoryFromUser("Open Dahu Project");

        // return if no given
        if( projectDirectoryName == null ) {
            return;
        }

        // calculate the path of the .dahu file to create
        var projectFilename = screencastController.getDahuFileFromDirectory(projectDirectoryName);

        // test if the file exists, return if true
        if (Kernel.module('filesystem').exists(projectFilename)) {
            //@todo throw an exception to the user!
            return;
        }

        // load the screencast project
        screencastController.create(projectFilename);

        // create the initial layout
        createLayout();
    }

    /**
     * Create a layout for opened or new projects
     *
     * @todo cleanup
     */
    function createLayout() {
        try {
            var layout = new DahuLayout();
            var screencastModel = screencastController.getScreencastModel();
            layout.render();
            app.frame.show(layout);
            // show screens in filmstrip region
            // if it's a new project, it is initialized with no screens.
            layout.filmstrip.show(new FilmstripScreensView({collection: screencastModel.get('screens')}));
            // Initialize the workspace with the first screen if available
            // if not, use an empty screen.
            workspaceScreen = new WorkspaceLayout();
            // Show workspace screen
            layout.workspace.show(workspaceScreen);
            // Show the screen actions & objects in the workspace layout.
            if (screencastModel.get('screens') == null) {
                workspaceLayoutController.showAllInLayout(workspaceScreen);
            }
            else {
                workspaceLayoutController.showAllInLayout(workspaceScreen, screencastModel.get('screens').at(0));
            }
        } catch(e) {
            Kernel.console.error(e.stack);
        }
    }

    /*
    * Save the current project
     */
    function onProjectSave(){
        screencastController.save();
    }

    /**
     * Show the selected filmstrip screen in the main region.
     */
    function onScreenSelect(screen) {
        // Change the model shown in the workspace layout if the
        // selected screen is different than the actual one.
        if (workspaceLayoutController.getCurrentScreen() != screen) {
            workspaceLayoutController.showAllInLayout(workspaceScreen, screen);
        }
    }
    /*
     * Start capture mode
     */
    function onCaptureStart() {
        //Start listening to the keyboard events
        Kernel.module('keyboard').start();
        Kernel.module('keyboard').addKeyListener("kernel:keyboard:onKeyRelease");
    }

    /**
     * Stop capture mode
     * use for debug to take a screenshot while keyboard not implemented
     */
    function onCaptureStop() {
        //Stop listening to the keyboard events
        Kernel.module('keyboard').removeKeyListener("kernel:keyboard:onKeyRelease");
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
            onCaptureStop();
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
     * @todo cleanup
     */
    function takeCapture() {
        // create new models
        var screen = new ScreenModel();
        var image = new ImageModel();
        var mouse = new MouseModel();
        var imgDir = screencastController.getProjectImgDirectory();
        // test if the image directory exists, if not create it
        if (!Kernel.module('filesystem').exists(imgDir)) {
            Kernel.module('filesystem').mkdir(imgDir);
        }
        // take the screenshot
        var capture = Kernel.module('media').takeCapture(imgDir, image.get('id'));
        // set the img path in image
        image.set('img', screencastController.getRelativeImgPath(capture.screen));
        // set the coordinates of the mouse cursor
        mouse.set('posx', capture.getMouseX());
        mouse.set('posy', capture.getMouseY());
        // Insert objects in the screen
        screen.get('objects').add(image);
        screen.get('objects').add(mouse);
        // Insert the screen in the screencast
        screencastController.getScreencastModel().get('screens').add(screen);
        // Refresh the workspace
        onScreenSelect(screen);
    }

    /**
     * Delete the selected screenshot.
     *
     * @todo cleanup and move part in screencast controller.
     */
    function deleteSelectedScreen() {
        var screencastModel = screencastController.getScreencastModel();
        var currentScreen = workspaceLayoutController.getCurrentScreen();
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
     *
     */
    function onPreview(){
        Kernel.console.info("onPreview");
        var path = screencastController.getDahuFileGeneratedScreencastFromDirectory(screencastController.getProjectBuildDirectory());
        Kernel.module('browser').runPreview(path);
    }

    /**
     * Clean the build directory
     */
    function onClean(){
        screencastController.clean();
    }

    /**
     * Generate the presentation in the build directory
     */
    function onGenerate(){
        screencastController.generate();
    }

    /**
     * Add a new tooltip
     * We show a popup window to ask the user to give the text of the tooltip.
     */
    function onTooltipAdd() {
        var tooltipText = Kernel.module('media').getInputPopup("Add a new tooltip",
            "Enter the text of your tooltip here");
        var screen = workspaceLayoutController.getCurrentScreen();
        screencastController.getScreencastModel().addTooltip(tooltipText, screen);
    }

    /**
     * Edit the text of a tooltip
     * @param tooltip
     */
    function onTooltipEdit(tooltip) {
        var newText = null;
        if (tooltip != null && tooltip.get('text') != undefined) {
            newText = Kernel.module('media').getInputPopup("Edit your tooltip", tooltip.get('text'));
        }
        if (newText != null) {
            tooltip.modifyText(newText);
        }
    }

    /**
     * Return the exported API.
     * All functions returned here will be
     * accessible from the browser and Java side.
     */
    return {
        // public start function
        start: function() { app.start(); },

        // we don't use app.event but our global events module
        events: events,

        // public stop function
        stop: function() { app.trigger("finalizers:after"); }

    }
});
