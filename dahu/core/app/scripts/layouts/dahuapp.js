/**
 * Created by barraq on 26/05/14.
 */

define([
    'underscore',
    'handlebars',
    'backbone.marionette',
    'text!templates/layouts/dahuapp.html'
], function(_, Handlebars, Marionette, Dahuapp_tpl){

    /**
     * Dahu application layout.
     */
    var ApplicationLayout = Backbone.Marionette.Layout.extend({
        id: 'dahuapp',
        className: 'layout-wrapper',
        template: Handlebars.default.compile(Dahuapp_tpl),

        regions: {
            filmstrip: "#filmstrip",
            workspace: "#workspace",
            note: "#note"
        }
    });

    return ApplicationLayout;
});
