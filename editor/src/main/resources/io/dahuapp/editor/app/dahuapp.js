"use strict";

/**
 * Dahuapp core module.
 * 
 * @param   window      window javascript object.
 * @param   $           jQuery
 * @returns dahuapp core module.
 */
(function(window, $) {
    var dahuapp = (function() {

        var self = {};

        /* private API */

        var _privateAttributeExample = ':o'; // eventually to remove

        function _privateFunctionExample(args) { // eventually to remove
            return "private hello " + args;
        }

        /* public API */

        self.version = "0.0.1";
        
        // eventually to remove
        self.publicFunctionExample = function publicFunctionExample(args) {
            return "public hello " + args;
        };

        return self;
    })();

    window.dahuapp = dahuapp;

})(window, jQuery);