/**
 * Created by pouzaudr on 6/4/14.
 */

define([], function() {

    var self;

    var fallback = {
        // here we must define some basic
        // implementation of the media
        // for debugging only
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            if(typeof(kernel) != "undefined" && typeof(kernel.media) != "undefined") {
                self = kernel.media;
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
