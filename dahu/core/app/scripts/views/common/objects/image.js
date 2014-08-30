/**
 * Created by barraq on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'modules/requestResponse',
    'text!templates/views/objects/image.html'
], function(Handlebars, Marionette, reqResponse, imageTemplate){

    /**
     * Screen image view
     */
    var imageView = Marionette.ItemView.extend({

        template: Handlebars.default.compile(imageTemplate),

        // set container classname to be 'image' plus its
        // image kind if a kind is defined.
        className: function() {
            return "image" + (this.model.get('kind') ? " "+this.model.get('kind') : '');
        }
    });

    return imageView;
});