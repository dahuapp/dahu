/**
 * Created by barraq on 08/05/14.
 */


/**
 * System Call Interface.
 *
 * The SCI is a thin layer that provides the means to perform
 * function calls from user space into the kernel.
 */

define([
    'underscore',
    'backbone',
    // kernel modules
    // @todo we might do some optimization (check with @barraq)
    'modules/kernel/console',
    'modules/kernel/filesystem',
    'modules/kernel/media'
], function(_, Backbone, Console, Filesystem, Media) {

    var self = {};

    // Kernel modules
    var modules = {};

    /**
     * Expose a module through the SCI
     *
     * @param name
     * @param module
     * @param mandatory
     */
    function expose(name, module, mandatory) {
        mandatory = mandatory || false;

        modules[name] = module.instance();
        if(mandatory) {
            self[name] = modules[name];
        }
    }

    self.start = function() {
        if(typeof(kernel) != "undefined") {
            // start the kernel
            kernel.start();
            expose('filesystem', Filesystem);
        } else {
            // we do not have an existing kernel
            // this case happen when we are running
            // in dev mode (when started with grunt)
            // modules loaded here or just for debugging purpose
            // you can load what you want!
            expose('filesystem', Filesystem); // fallback Filesystem
        }

        // console is mandatory
        expose('console', Console, true);

        // expose media
        expose('media', Media);
    };

    /**
     * Kernel module accessor.
     *
     * @param name
     * @returns {*}
     */
    self.module = function(name) {
        if( _.has(modules, name) ) {
            return modules[name];
        }

        if( typeof(self.console) != "undefined" ) {
            self.console.error("The module '{}' is not loaded in the kernel.", name);
        }

        // @todo shall we throw an exception?
        return null;
    };

    /**
     * Stop the kernel
     */
    self.stop = function() {
        if(typeof(kernel) != "undefined") {
            // start the kernel
            kernel.stop();
        }
    };

    return self;
});
