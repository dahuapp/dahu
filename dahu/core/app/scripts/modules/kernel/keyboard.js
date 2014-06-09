/**
 * Created by nabilbenabbou1 on 6/4/14.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the keyboard
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.keyboard) != "undefined") {
                self = kernel.keyboard;
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