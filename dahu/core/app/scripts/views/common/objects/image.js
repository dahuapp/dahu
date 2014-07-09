/**
 * Created by barraq on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'modules/requestResponse',
    'text!templates/views/objects/image.html'
], function(Handlebars, Marionette, reqResponse, Image_tpl){

    /**
     * Screen image view
     */
    var imageView = Marionette.ItemView.extend({

        // set container classname to be 'image' plus its
        // image kind if a kind is defined.
        className: function() {
            return "image" + (this.model.get('kind') ? " "+this.model.get('kind') : '');
        },

        template: Handlebars.default.compile(Image_tpl),

        templateHelpers: {
            // The name of the picture's full path
            imgFullPath: function() {
                return reqResponse.request("app:screencast:controller").getImgFullPath(this.img);
            }
        }
    });

    return imageView;
});