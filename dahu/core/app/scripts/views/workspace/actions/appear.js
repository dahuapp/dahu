/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // templates
    'text!templates/views/workspace/actions/appear.html'
], function(
    Handlebars,
    Marionette,
    // templates
    appearTemplate){

    /**
     * Appear action view
     */
    return Marionette.ItemView.extend({
        template: Handlebars.default.compile(appearTemplate)
    });
});