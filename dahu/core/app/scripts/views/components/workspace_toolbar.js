/**
 * Created by barraq on 8/12/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/kernel/SCI',
    'modules/commands',
    // templates
    'text!templates/views/components/workspace_toolbar.html'
], function(
    Handlebars, Marionette,
    Kernel, commands,
    // templates
    toolbarTemplate){

    /**
     * Mouse view
     */
    return Marionette.ItemView.extend({
        template: Handlebars.default.compile(toolbarTemplate),

        ui: {
            'tooltip': 'button#toolbar-action-tooltip'
        },

        triggers: {
            'click @ui.tooltip': 'tooltip:click'
        }
    });
});