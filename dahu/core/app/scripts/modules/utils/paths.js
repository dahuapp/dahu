/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'modules/requestResponse',
    'modules/kernel/SCI'
], function(_, ReqResponse, Kernel){

    var fileSeparator = Kernel.module('filesystem').FILE_SEPARATOR;

    /**
     * Join one or more path components intelligently.
     */
    function join(paths) {
        var fullPath = "";
        // concatenate the single path to the full path iteratively
        _.each(paths, function(path) {
            var newPath = path;
            var length = newPath.length;
            // Delete the last fileSeparator if it's the last character
            if (newPath.lastIndexOf(fileSeparator) == length-1) {
                newPath = newPath.substring(0, length-1);
            }
            // Add a fileSeparator (if not there) to fullPath if we
            // are to concatenate with another path.
            length = fullPath.length;
            if (length > 0 && fullPath.lastIndexOf(fileSeparator) < length-1) {
                // We test if the new path to concatenate starts with a fileSeparator
                if (newPath.charAt(0) != fileSeparator) {
                    fullPath = fullPath.concat(fileSeparator);
                }
            }
            fullPath = fullPath.concat(newPath);
        });
        return fullPath;
    }

    /**
     * Gets the full path of a project picture.
     */
    function getImgFullPath(img) {
        var dir = ReqResponse.request("app:projectDirectory");
        return join(['dahufile:', dir, img]);
    }

    return {
        join: join,
        getImgFullPath: getImgFullPath
    };
});
