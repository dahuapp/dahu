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
            deps: ['jquery','underscore'],
            exports: 'Backbone'
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
        jquery: '../components/jquery/dist/jquery',
        backbone: '../components/backbone/backbone',
        underscore: '../components/underscore/underscore',
        bootstrap: '../components/sass-bootstrap/dist/js/bootstrap',
        handlebars: '../components/handlebars/handlebars',
        uuid: '../components/node-uuid/uuid'
    }
});

// Define app
define('dahuapp', [
    'jquery',
    'underscore',
    'backbone',
    'modules/kernel/SCI',
    'modules/events',
    'models/screencast'
], function($, _, Backbone, Kernel, events, ScreencastModel) {

    var projectFilename;
    var projectScreencast;

    /**
     * Start the application.
     */
    function start() {
        Kernel.start();
        initBackbone();
        initEvent();
    }

    /**
     * Bind events to Dahu application functions.
     */
    function initEvent() {
        events.on('app:onFileOpen', function() {
            onFileOpen();
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
                    Kernel.console.log(model.toJSON());
                    Kernel.module('filesystem').writeToFile(projectFilename, model.toJSON());
                }
                //@todo handle other methods
            } else {
                Kernel.console.log("ignore sync for method {} on model {}", method, model)
            }
        };
    }

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

        //@todo
        // 5. display it
    }

    /**
     * Stop the application
     */
    function stop() {
        Kernel.stop();
    }

    /**
     * Return the exported API.
     * All functions returned here will be
     * accessible from the browser and Java side.
     */
    return {
        start: start,
        events: events,
        stop: stop
    }
});
