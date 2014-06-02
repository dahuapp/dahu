/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'modules/requestResponse'
], function(_, ReqResponse){

    /**
     * Join one or more path components intelligently.
     */
    function join(paths) {
        var fullPath = "";
        // concatenate the single path to the full path iteratively
        _.each(paths, function(path) {
            var newPath = path;
            var length = newPath.length;
            // Delete the last slash if it's the last character
            if (newPath.lastIndexOf('/') == length-1) {
                newPath = newPath.substring(0, length-1);
            }
            // Add a slash (if not there) to fullPath if we
            // are to concatenate with another path.
            length = fullPath.length;
            if (length > 0 && fullPath.lastIndexOf('/') < length-1) {
                // We test if the new path to concatenate starts with a slash
                if (newPath.charAt(0) != "/") {
                    fullPath = fullPath.concat('/');
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
