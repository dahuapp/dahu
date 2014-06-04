/**
 * Created by mouad on 04/06/14.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the mouse
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.mouse) != "undefined") {
                self = kernel.mouse;
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