/**
 * Created by mouad on 06/06/14.
 */

define([
    'backbone.marionette',
    'modules/utils/paths',
    'modules/requestResponse'
], function (Marionette, Paths, ReqResponse) {

    /**
     * Screencast controller
     */
    var ScreencastController = Marionette.Controller.extend({

        /**
         * Gets the full path of a project picture
         */
        getImgFullPath: function(img) {
            var dir = ReqResponse.request("app:projectDirectory");
            return Paths.join(['dahufile:', dir, img]);
        },

        /**
         * Gets the name of the presentation to create relating to
         * a directory.
         * @param directory of the project
         */
        getDahuFileFromDirectory: function (directory) {
            return Paths.join([directory, 'presentation.dahu']);
        }
    });

    return ScreencastController;

});