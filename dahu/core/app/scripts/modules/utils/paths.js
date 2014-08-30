/**
 * Paths utility.
 *
 * @warning Be cautious when adding new dependency: this module must not depend on modules that
 * rely DOM (e.g. JQuery, Backbone.Marionette, Backbone.Wreqr, etc.).
 */

define([
    'underscore',
    'modules/kernel/SCI'
], function(_, Kernel){

     // Unix file separator (used for all Linux, Windows, OsX platforms).
     // All path manipulated within Dahu are normalized Unix path.
    var FILE_SEPARATOR = '/';

    /**
     * Split the input `path` into a list of paths.
     * @param path Path to split.
     */
    function split(path) {
        return path.split(FILE_SEPARATOR);
    }

    /**
     * Join one or more path components intelligently.
     * @see https://gist.github.com/creationix/7435851
     */
    function join(paths) {
        // Split the inputs into a list of path commands.
        var parts = [];
        for (var i = 0, l = paths.length; i < l; i++) {
            parts = parts.concat(split(paths[i]));
        }
        // Interpret the path commands to get the new resolved path.
        var newParts = [];
        for (i = 0, l = parts.length; i < l; i++) {
            var part = parts[i];
            // Remove leading and trailing slashes
            // Also remove "." segments
            if (!part || part === '.') continue;
            // Interpret ".." to pop the last segment
            if (part === "..") newParts.pop();
            // Push new path segments.
            else newParts.push(part);
        }
        // Preserve the initial slash if there was one.
        if (parts[0] === "") newParts.unshift("");
        // Turn back into a single string path.
        return newParts.join(FILE_SEPARATOR) || (newParts.length ? FILE_SEPARATOR : ".");
    }

    /**
     * Get directory name from a path.
     *
     * @param path
     * @returns {string} directory name.
     */
    function dirname(path) {
        return path.substring(0, path.lastIndexOf(FILE_SEPARATOR) + 1);
    }

    /**
     * Check whether or not a `path` is relative.
     *
     * @param path
     * @returns {boolean} true if relative, false otherwise.
     */
    function isRelative(path) {
        return !isAbsolute(path);
    }

    /**
     * Check whether or not a `path` is absolute.
     *
     * @param path
     * @returns {boolean} true if absolute, false otherwise.
     */
    function isAbsolute(path) {
        return path.indexOf(FILE_SEPARATOR) == 0;
    }

    return {
        join: join,
        isRelative: isRelative,
        isAbsolute: isAbsolute,
        dirname: dirname
    };
});
