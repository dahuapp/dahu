/**
 * Created by dufourau on 6/5/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/tooltip.html'
], function(Handlebars, Marionette, Objetcs_tooltip_tpl){

    /**
     * Screen background view
     */
    var mouseView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Objetcs_tooltip_tpl)
    });

    return mouseView;
});