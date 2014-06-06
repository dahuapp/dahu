/**
 * Created by dufourau on 6/5/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/image.html',
    'modules/utils/paths'
], function(Handlebars, Marionette, Workspace_image_tpl, Paths){

    /**
     * Screen image view
     */
    var imageView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Workspace_image_tpl),
        templateHelpers: {
            // The name of the picture's full path
            imgFullPath: function() {
                return Paths.getImgFullPath(this.img);
            }
        }
    });

    return imageView;
});