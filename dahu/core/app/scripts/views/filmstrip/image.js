/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/image.html',
    'modules/requestResponse'
], function(Handlebars, Marionette, Filmstrip_image_tpl, reqResponse){

    /**
     * Screen image view
     */
    var imageView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Filmstrip_image_tpl),
        templateHelpers: {
            // The name of the picture's full path
            imgFullPath: function() {
                return reqResponse.request("app:screencast:controller").getImgFullPath(this.img);
            }
        }
    });

    return imageView;
});