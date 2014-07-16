/**
 * Created by barraq on 7/16/14.
 */

/**
 * Exceptions wrapper module.
 *
 * This module exposes various Exception type.
 * Hierarchy of exceptions is inspired from Python exceptions.
 *
 * {@see https://docs.python.org/3/library/exceptions.html#exception-hierarchy}
 */
define(['underscore'], function (_) {

    // Helpers to extend "class" taken from CoffeeScript.
    var __hasProp = {}.hasOwnProperty;
    var __extends = function (child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

    /**
     * Base Exception class
     */
    var Exception = (function(_super) {
        __extends(Exception, _super);

        function Exception(type, message, args) {
            Exception.__super__.constructor.call(this);

            this.type = type;
            this.message = message;
            this.args = args;
        }

        Exception.prototype.toString = function () {
            var formattedMessage = _.template(
                this.message, this.args,
                { interpolate: /\{(.+?)\}/g });

            return "[" + this.type + "] " + formattedMessage + "\n\n" + this.stack;
        };

        return Exception;
    })(Error);

    /**
     * Input/Output exceptions.
     */
    var IOError = (function(_super) {
        __extends(IOError, _super);

        function IOError(message, args) {
            IOError.__super__.constructor.call(this, this.constructor.name, message, args);
        }

        return IOError;

    })(Exception);

    return {
        IOError: IOError
    }
});