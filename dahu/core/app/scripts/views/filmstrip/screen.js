/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/screen.html'
], function(Handlebars, Marionette, Filmstrip_screen_tpl){

    /**
     * Filmstrip screen view
     */
    var ScreenView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl)
    });

    return ScreenView;
});