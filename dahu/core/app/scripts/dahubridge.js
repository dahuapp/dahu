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
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    shim: {
        cheerio: {
            exports: '$'
        },
        lodash: {
            exports: '_'
        },
        backbone: {
            deps: ['cheerio', 'lodash'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        uuid: {
            exports: 'uuid'
        }
    },
    paths: {
        'text': '../components/requirejs-text/text',
        'backbone': '../components/backbone/backbone',
        'lodash': '../components/lodash/dist/lodash',
        'handlebars': '../components/handlebars/handlebars.amd',
        'uuid': '../components/node-uuid/uuid',

        // JQuery cannot be used in Nashorn, use `cheerio` instead
        'jquery': 'empty:',
        'cheerio': '../components/cheerio/lib/cheerio'
    }
});

// Define patcher
define('patcher', ['modules/patches/backbone'], function(Backbone) {
    return {
        patch: function() {
            Backbone.patch();
        }
    }
});

// Define bridge
define('dahubridge', [
    'patcher',
    // libraries
    'backbone',
    // modules
    'modules/kernel/SCI',
    'modules/screencast',
    // models
    'models/screencast'
], function(
    Patcher,
    Backbone,
    Kernel, Screencast,
    ScreencastModel
) {
    //
    // Patch JavaScript-lang and libraries
    //
    Patcher.patch();

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

    /**
     * Generate a screencast.
     *
     * @param projectFilename
     */
    function generate(projectFilename) {
        try {
            var screencast = Screencast.load(projectFilename);
            screencast.generate();
        } catch(e) {
            Kernel.console.error(e);
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