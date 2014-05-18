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

    /**
     * Start the application.
     */
    function start() {
        Kernel.start();
        initEvent();
    }

    function initEvent() {
        events.on('app:onFileOpen', function() {
            onFileOpen();
        })
    }

    /**
     * Open a Dahu project file.
     * This prompts the user to select a .dahu file.
     */
    function onFileOpen() {
        var selectedFile = Kernel.module('filesystem').getFileFromUser("Open Dahu Project", "dahuProjectFile");
        if( selectedFile != null ) {
            Kernel.module('filesystem').grantAccessToDahuProject(selectedFile);

            //@todo
            // 1. read the file
            // 2. check dahu file version (old one or new one)
            // 3. convert if old one
            // 4. create a screencast model with data
            // 5. display it
        }
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
