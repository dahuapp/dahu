/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/background.html'
], function(Handlebars, Marionette, Filmstrip_background_tpl){

    /**
     * Screen background view
     */
    var backgroundView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Filmstrip_background_tpl)
    });

    return backgroundView;
});