/**
 * Created by dufourau on 6/5/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/background.html',
    'modules/utils/paths'
], function(Handlebars, Marionette, Workspace_background_tpl, Paths){

    /**
     * Screen background view
     */
    var backgroundView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Workspace_background_tpl),
        templateHelpers: {
            // The name of the picture's full path
            imgFullPath: function() {
                return Paths.getImgFullPath(this.img);
            }
        }
    });

    return backgroundView;
});