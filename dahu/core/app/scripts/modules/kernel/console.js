/**
 * Created by barraq on 15/05/14.
 */

/**
 * Console kernel module.
 */
define(['underscore'], function(_) {

    var self;

    // console methods
    var methods = ["log", "info", "warn", "debug", "error"];

    /**
     * LogBack/SL4J like formatter.
     *
     * Usages:
     *
     * - format("my message");
     * - format("my message with {} and {}", 3, "test")
     *
     * @warning does not support \\{} escaping.
     * @returns {String} Formatted string.
     */
    function format() {
        var params = Array.prototype.slice.call(arguments);
        if(params.length>0) {
            var msg = params.shift();
            for(var i in params) {
                msg = msg.replace(/\{\}/, params[i]);
            }
            return msg;
        } else {
            return params;
        }
    }

    // singleton

    function instance() {
        if(typeof(self) === 'undefined') {
            // load the delegated console
            if(typeof(kernel) != "undefined" && kernel.console) {
                self = _.object(_.map(methods, function(name) {
                    return [name, (function(name) {
                        return function() {
                            var msg = format.apply(this, arguments);
                            kernel.console[name](msg); // external log
                            window.console[name](msg); // debug log
                        }
                    }(name))]
                }));
            } else {
                self = _.object(_.map(methods, function(name) {
                    return [name, (function(name) {
                        return function() {
                            var msg = format.apply(this, arguments);
                            window.console[name](msg);
                        }
                    }(name))];
                }));
            }
        }

        return self;
    }

    return {
        instance: instance
    }
})