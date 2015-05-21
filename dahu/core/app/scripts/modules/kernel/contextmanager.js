/**
 * Created by coutinju on 21/05/15.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the contextmanager
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.contextmanager) != "undefined") {
                self = kernel.contextmanager;
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