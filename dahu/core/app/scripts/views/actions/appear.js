/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/appear.html'
], function(Handlebars, Marionette, Actions_appear_tpl){

    /**
     * Appear action view
     */
    var appearView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_appear_tpl)
    });

    return appearView;
});