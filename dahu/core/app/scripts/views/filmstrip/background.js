/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/background.html',
    'modules/utils/paths'
], function(Handlebars, Marionette, Filmstrip_background_tpl, Paths){

    /**
     * Screen background view
     */
    var backgroundView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Filmstrip_background_tpl),
        templateHelpers: {
            // The name of the picture's full path
            imgFullPath: function() {
                return Paths.getImgFullPath(this.img);
            }
        }
    });

    return backgroundView;
});