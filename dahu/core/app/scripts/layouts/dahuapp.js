/**
 * Created by barraq on 26/05/14.
 */

define([
    'underscore',
    'handlebars',
    'backbone.marionette',
    'text!templates/layouts/dahuapp.html'
], function(_, Handlebars, Marionette, dahuappTemplate){

    /**
     * Dahu application layout.
     */
    var ApplicationLayout = Backbone.Marionette.LayoutView.extend({
        id: 'dahuapp',
        className: 'layout-wrapper',
        template: Handlebars.default.compile(dahuappTemplate),

        regions: {
            toolbar: "#main-toolbar",
            filmstrip: "#filmstrip",
            workspace: "#workspace"
        }
    });

    return ApplicationLayout;
});
