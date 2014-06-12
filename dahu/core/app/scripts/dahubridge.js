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
    'modules/compiler',
    'modules/kernel/SCI'
], function(Compiler, Kernel) {

    /**
     * Start bridge
     */
    function start() {
        Kernel.start();
    }

    /**
     * Stop bridge
     */
    function stop() {
        Kernel.stop();
    }


    return {
        start: start,
        stop: stop,

        // @todo remove this, this is only a sample
        hello: Compiler.hello,
        createScreencast: Compiler.createScreencast
    }
});