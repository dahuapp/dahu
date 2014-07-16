/*global require*/
'use strict';

/**
 * Compiler specific configuration. This configuration must be used
 * only when the compiler is used as a standalone module.
 */

// How to replace jQuery:
// - https://hacks.mozilla.org/2013/04/serving-backbone-for-robots-legacy-browsers/
// - http://dph.am/blog/2013/02/07/backbone-models-with-requirejs-in-node/

require.config({
    baseUrl: 'scripts/',
    shim: {
        cheerio: {
            exports: 'cheerio'
        },
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
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
        handlebars: {
            exports: 'Handlebars'
        },
        uuid: {
            exports: 'uuid'
        }
    },
    paths: {
        text: '../components/requirejs-text/text',
        backbone: '../components/backbone/backbone',
        'backbone.marionette' : '../components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr' : '../components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter' : '../components/backbone.babysitter/lib/backbone.babysitter',
        underscore: '../components/underscore/underscore',
        handlebars: '../components/handlebars/handlebars.amd',
        uuid: '../components/node-uuid/uuid',

        // JQuery cannot be used in Nashorn
        jquery: 'empty:',
        cheerio: '../components/cheerio/lib/cheerio'
    }
});

// Define bridge
define('dahubridge', [
    'backbone',
    // modules
    'modules/kernel/SCI',
    'modules/screencast',
    // models
    'models/screencast'
], function(
    Backbone,
    Kernel,
    Screencast,
    ScreencastModel
) {

    var screencastController;

    /**
     * Start bridge
     */
    function start() {
        Kernel.start();
        initBackbone();
    }

    /**
     * Initialize Backbone
     */
    function initBackbone() {
        // don't use history since it requires a DOM
        //Backbone.history.start();

        // override global sync method
        Backbone.sync = function (method, model, options) {
            if (model instanceof ScreencastModel) {
                Kernel.console.debug("Sync screencast model for method {}", method);
                if( method === 'create' ) {
                    // define the indentation value to write the updated dahu file
                    var indentation = 4;
                    Kernel.module('filesystem').writeToFile(screencastController.getProjectFilename(), model.toJSON(indentation));
                }
                //@todo handle other methods
            } else {
                Kernel.console.debug("ignore sync for method {} on model {}", method, JSON.stringify(model));
            }
        };
    }

    /**
     * Generate a screencast.
     *
     * @param projectFilename
     */
    function generate(projectFilename) {
        try {
            var screencastModel = Screencast.load(projectFilename);
            Screencast.generate(screencastModel, projectFilename);
        } catch(e) {
            Kernel.console.error(e.stack);
        }
    }

    /**
     * Stop bridge
     */
    function stop() {
        Kernel.stop();
    }


    return {
        start: start,
        generate: generate,
        stop: stop
    }
});