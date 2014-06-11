/**
 * Created by pouzaudr on 6/10/14.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the browser
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.browser) != "undefined") {
                self = kernel.browser;
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
