/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/disappear.html'
], function(Handlebars, Marionette, Actions_disappear_tpl){

    /**
     * Disappear action view
     */
    var disappearView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_disappear_tpl)
    });

    return disappearView;
});