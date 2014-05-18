/**
 * Created by barraq on 15/05/14.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the filesystem
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.filesystem) != "undefined") {
                self = kernel.filesystem;
            } else {
                self = fallback;
            }
        }

        return self

    }

    return {
        instance: instance
    }
});
