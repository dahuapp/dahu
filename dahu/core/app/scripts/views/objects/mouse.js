/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/mouse.html'
], function(Handlebars, Marionette, Objetcs_mouse_tpl){

    /**
     * Screen background view
     */
    var mouseView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Objetcs_mouse_tpl)
    });

    return mouseView;
});