/**
 * Created by barraq on 8/12/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/kernel/SCI',
    'modules/events',
    // templates
    'text!templates/views/components/main_toolbar.html'
], function(
    Handlebars, Marionette,
    Kernel, events,
    // templates
    toolbarTemplate){

    /**
     * Mouse view
     */
    return Marionette.ItemView.extend({
        template: Handlebars.default.compile(toolbarTemplate),

        ui: {
            'preview': 'button#toolbar-action-preview',
            'properties': 'button#toolbar-action-properties',
            'fullscreen': 'button#toolbar-action-fullscreen'
        },

        events: {
            'click @ui.preview': 'startPreview',
            'click @ui.properties': 'openPropertyPane',
            'click @ui.fullscreen': 'activateFullscreenMode'
        },

        modelEvents: {
            'change:metadata': 'metadataChanged'
        },

        initialize: function(options) {
            _.extend(this, _.pick(options, ['screencast']));

            // we render screens collection from screencast model.
            this.model = this.screencast.model;
        },

        metadataChanged: function() {
            this.$('.navbar-title').text(this.model.get('metadata').get('title'));
        },

        startPreview: function() {
            events.trigger('app:onPreview');
        },

        openPropertyPane: function() {
            events.trigger('app:openPropertyPane');
        },

        activateFullscreenMode: function() {
            events.trigger('app:activateFullscreenMode');
        }
    });
});