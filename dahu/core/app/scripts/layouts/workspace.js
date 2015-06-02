/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'underscore',
    'handlebars',
    'backbone.marionette',
    // views
    'views/workspace/screen',
    'views/workspace/actions',
    'views/workspace/note',
    // template
    'text!templates/layouts/workspace.html'
], function(
    _, Handlebars, Marionette, 
    screenView, actionsView, noteView, // views
    workspaceTemplate // template
) {

    /**
     * Dahu workspace layout.
     */
    var WorkspaceLayout = Backbone.Marionette.LayoutView.extend({
        className: 'layout-wrapper',
        template: Handlebars.default.compile(workspaceTemplate),

        regions: {
            toolbar: '#workspace-toolbar',
            screenEditor: '#workspace-screen',
            actionsEditor: '#workspace-actions',
            noteEditor: '#workspace-note'
        }
    });

    return WorkspaceLayout;
});
