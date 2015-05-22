/**
 * Created by barraq on 7/16/14.
 */

/**
 * Exceptions wrapper module.
 *
 * This module exposes various Error types.
 * The error hierarchy is the following:
 *
 * - Error
 *   - ExtendedError
 *     - IOError
 *     - RuntimeError
 *     - NotImplementedError
 *
 * Usage:
 * throw new Exceptions.IOError("some message with argument: #{param}", { param: "toto"});
 * throw new Exceptions.IOError("some message without argument");
 */
define(['underscore'], function (_) {

    var Exceptions = {};

    /**
     * Base class for extensible Error.
     *
     * Contrary to Error, this error will be correctly derivable.
     *
     * new ExtendedError(someError);
     * new ExtenderError(someMessage, someArgs...);
     */
    var ExtendedError = function() {
        var error, message,
            name = 'ExtendedError',
            params = Array.prototype.slice.call(arguments);

        if (params.length == 1 && params[0] instanceof Error) {
            error = params[0];
            message = error.message;
            name = error.name || name;
        } else {
            var msg = params.length > 0 ? params.shift() : '';
            var args = params.length > 0 ? params.shift() : {};
            message = _.template(msg, args, { interpolate: /\#\{(.+?)\}/g });
            // we must create an error to have an up-to-date stack trace
            error = new Error(message);
        }

        // setup object
        this.message = message;
        this.stack = error.stack;
        this.name = name;
    };

    ExtendedError.prototype = Object.create(Error.prototype);
    ExtendedError.prototype.constructor = ExtendedError;

    /**
     * ExtendedError factory.
     *
     * @param name Name of the extended error.
     * @param parentErrorClass
     * @returns {CustomExtendedErrorClass}
     * @constructor
     */
    var ExtendedErrorFactory = function(name, parentErrorClass) {
        if (typeof parentErrorClass === 'undefined') {
            parentErrorClass = ExtendedError;
        }

        function CustomExtendedErrorClass() {
            parentErrorClass.prototype.constructor.apply(this, arguments);
            this.name = name;
        }
        CustomExtendedErrorClass.prototype = Object.create(parentErrorClass.prototype);
        CustomExtendedErrorClass.prototype.constructor = CustomExtendedErrorClass;

        return CustomExtendedErrorClass;
    };

    // setup Error hierarchy
    Exceptions.create = ExtendedErrorFactory;
    Exceptions.ExtendedError = ExtendedError;
    Exceptions.IOError = ExtendedErrorFactory('IOError', ExtendedError);
    Exceptions.RuntimeError = ExtendedErrorFactory('RuntimeError', ExtendedError);
    Exceptions.NotImplementedError = ExtendedErrorFactory('NotImplementedError', ExtendedError);

    // export it
    return Exceptions;
});