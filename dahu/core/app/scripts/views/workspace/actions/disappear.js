/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // templates
    'text!templates/views/workspace/actions/disappear.html'
], function(
    Handlebars,
    Marionette,
    // templates
    disappearTemplate
) {
    
    /**
     * Disappear action view
     */
    return Marionette.ItemView.extend({
        template: Handlebars.default.compile(disappearTemplate)
    });
});