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
         * Gets the path of the project directory
         * @returns String
         */
        getProjectDirectory: function(){
            return Paths.dirname(ReqResponse.request("app:projectFilePath"));
        },

        /**
         * Gets the full path of a project picture
         */
        getImgFullPath: function(img) {
            var dir = this.getProjectDirectory();
            return Paths.join(['dahufile:', dir, img]);
        },

        /**
         * Gets the name of the presentation to create relating to
         * a directory.
         * @param directory of the project
         */
        getDahuFileFromDirectory: function (directory) {
            return Paths.join([directory, 'presentation.dahu']);
        },

        /**
         * Gets the full path of the img directory of the current project
         */
        getProjectImgDirectory: function () {
            var dir = this.getProjectDirectory();
            return Paths.join([dir, 'img']);
        },

        /**
         * Gets the relative path of the img file of the current project
         * i.e : 'img/nameOfImg.extension'
         */
        getRelativeImgPath: function (img) {
            return Paths.join(['img', img]);
        }
    });

    return ScreencastController;

});