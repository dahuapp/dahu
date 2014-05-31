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
    'models/screencast',
    'layouts/dahuapp',
    'views/filmstrip/screens'
], function($, _, Backbone, Marionette, Kernel, events, ScreencastModel, DahuLayout, FilmstripScreensView) {

    var projectFilename;
    var projectScreencast;

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
        events.on('app:onFileOpen', function() {
            onFileOpen();
        })
        //@todo add other events
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

        //// begin - work in progress
        //// @todo display the list of screens
        try {
            var layout = new DahuLayout();
            layout.render();
            app.frame.show(layout);
            // show screens in filmstrip region
            layout.filmstrip.show(new FilmstripScreensView({collection: projectScreencast.get('screens')}));
        } catch(e) {
            Kernel.console.error(e.stack);
        }
        //// end - work in progress
    }

    // Debug only

    function getModel() {
        return projectScreencast;
    }

    /**
     * Return the exported API.
     * All functions returned here will be
     * accessible from the browser and Java side.
     */
    return {
        // public start function
        start: function() { app.start(); },

        // we don't use app.vent but our global events module
        events: events,

        // public stop function
        stop: function() { app.trigger("finalizers:after"); },

        // @warning for debug only
        app: app,
        model: getModel
    }
});
