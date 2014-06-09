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

        /*
        * Gets the full path of a project picture
         */
        getImgFullPath: function(img) {
            var dir = ReqResponse.request("app:projectDirectory");
            return Paths.join(['dahufile:', dir, img]);
        }

    });

    return ScreencastController;

});