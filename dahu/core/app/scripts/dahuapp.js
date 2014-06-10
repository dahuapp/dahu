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
    'modules/kernel/SCI',
    'modules/events',
    'modules/requestResponse',
    'modules/utils/paths',
    'controller/screencast',
    'models/screencast',
    'models/screen',
    'models/objects/background',
    'models/objects/mouse',
    'layouts/dahuapp',
    'views/filmstrip/screens',
    'views/workspace/screen',
    'collections/screens'
], function($, _, Backbone, Marionette, Kernel, events, reqResponse, Paths,
            ScreencastController, ScreencastModel, ScreenModel, BackgroundModel, MouseModel, DahuLayout,
            FilmstripScreensView, WorkspaceScreenView, ScreensCollection) {

    var projectFilename;
    var projectScreencast;
    var workSpaceScreen;
    var screencastController;
    var screensToDelete;

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
        //@todo add other events
    }

    /**
     * Initializes the project controllers
     */
    function initController() {
        screencastController = new ScreencastController({model : projectScreencast});
    }

    /**
     * Bind Requests to Specified functions.
     * Requests are used to answer some common
     * questions that modules can need.
     */
    function initRequestResponse() {
        // Prepare a response that gives the project directory.
        reqResponse.setHandler("app:projectDirectory", function(){
            if (projectFilename != null) {
                var indexOfLastSlash = projectFilename.lastIndexOf('/');
                return projectFilename.substring(0, indexOfLastSlash + 1);
            }
            return null;
        })
        // Prepare a response that gives the project screencast controller
        reqResponse.setHandler("app:screencast:controller", function(){
            return screencastController;
        })
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
                    Kernel.module('filesystem').writeToFile(projectFilename, model.toJSON(indentation));
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
        projectFilename = Kernel.module('filesystem').getFileFromUser("Open Dahu Project", "dahuProjectFile");

        // return if no given
        if( projectFilename == null ) {
            return;
        }

        // read project file content
        var projectFileContent = Kernel.module('filesystem').readFromFile(projectFilename);

        // return if content is null
        if( projectFileContent == null ) {
            return;
        }

        // check if an upgrade is needed, if yes create a backup of old version.
        var needAnUpgrade = ScreencastModel.needToUpgradeVersion(projectFileContent);
        if( needAnUpgrade ) {
            Kernel.module('filesystem').copyFile(projectFilename, projectFilename+'.old')
        }

        // load the screencast
        projectScreencast = ScreencastModel.newFromString(projectFileContent);

        // save it if it was an upgrade
        if( needAnUpgrade ) {
            projectScreencast.save();
        }

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // create the layout
        createLayout();
    }

    /**
     * Create a Dahu project file.
     * This prompts the user to select a directory destination.
     */
    function onFileCreate() {
        // ask user for project destination
        projectDirectoryName = Kernel.module('filesystem').getDirectoryFromUser("Open Dahu Project");

        // calculate the path of the .dahu file to create
        projectFilename = screencastController.getDahuFileFromDirectory(projectDirectoryName);

        // return if no given
        if( projectDirectoryName == null ) {
            return;
        }

        // test if the file exists, return if true
        if (Kernel.module('filesystem').exists(projectFilename)) {
            return;
        }

        //@todo : Ask the user to specify some MetaData & settings.

        // create project screencast
        projectScreencast = new ScreencastModel();

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // create project file
        projectScreencast.save();

        // create the initial layout
        createLayout();
    }

    /**
     * Create a layout for opened or new projects
     */
    function createLayout() {
        try {
            var layout = new DahuLayout();
            layout.render();
            app.frame.show(layout);
            // show screens in filmstrip region
            // if it's a new project, it is initialized with no screens.
            layout.filmstrip.show(new FilmstripScreensView({collection: projectScreencast.get('screens')}));
            // Initialize the workspace with the first screen if available
            // if not, use an empty screen.
            if (projectScreencast.get('screens') == null) {
                workSpaceScreen = new WorkspaceScreenView();
            }
            else {
                workSpaceScreen =  new WorkspaceScreenView({model: projectScreencast.get('screens').at(0)});
            }
            // Show workspace screen
            layout.workspace.show(workSpaceScreen);
        } catch(e) {
            Kernel.console.error(e.stack);
        }
    }

    /*
    * Save the current project
     */
    function onProjectSave(){
        if(projectScreencast){
            projectScreencast.save();
        }
    }

    /**
     * Show the selected filmstrip screen in the main region.
     */
    function onScreenSelect(screen) {
        // Change the model of the workspace screen if the
        // selected screen is different than the actual one.
        if (workSpaceScreen.model != screen) {
            workSpaceScreen.setModel(screen);
        }
    }
    /*
     * Start capture mode
     */
    function onCaptureStart() {
        //Start listening to the keyboard events
        Kernel.module('keyboard').addKeyListener("kernel:keyboard:onKeyRelease");
    }

    /**
     * Stop capture mode
     * use for debug to take a screenshot while keyboard not implemented
     */
    function onCaptureStop() {
        //Stop listening to the keyboard events
        Kernel.module('keyboard').removeKeyListener("kernel:keyboard:onKeyRelease");
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
     */
    function takeCapture() {
        // create new models
        var screen = new ScreenModel();
        var background = new BackgroundModel();
        var mouse = new MouseModel();
        // take the screenshot
        var imgDir = Paths.getProjectImgDirectory();
        var capture = Kernel.module('media').takeCapture(imgDir, background.get('id'));
        // set the img path in background
        background.set('img', Paths.getRelativeImgPath(capture.screen));
        // set the coordinates of the mouse cursor
        mouse.set('posX', capture.getMouseX());
        mouse.set('posY', capture.getMouseY());
        // Insert objects in the screen
        screen.get('objects').add(background);
        screen.get('objects').add(mouse);
        // Insert the screen in the screencast
        projectScreencast.get('screens').add(screen);
        // Refresh the workspace
        onScreenSelect(screen);
    }

    /**
     * Delete the selected screenshot
     */
    function deleteSelectedScreen() {
        var currentScreen = workSpaceScreen.model;
        var id = projectScreencast.get('screens').indexOf(currentScreen);
        var nbOfScreens = projectScreencast.get('screens').size();
        // delete screen model
        currentScreen = projectScreencast.get('screens').remove(currentScreen);
        // put the picture file on a wait to delete list
        if (screensToDelete == undefined) {
            screensToDelete = new ScreensCollection();
        }
        screensToDelete.add(currentScreen);

        // select the next screen to show in the workspace
        if (id == nbOfScreens -1) {
            id --;
        }
        onScreenSelect(projectScreencast.get('screens').at(id));

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
