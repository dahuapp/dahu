/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'underscore',
    'handlebars',
    'backbone.marionette',
    'views/workspace/screen',
    'views/workspace/actions',
    'text!templates/layouts/workspace.html'
], function(_, Handlebars, Marionette, screenView, actionsView, Workspace_tpl){

    /**
     * Dahu workspace layout.
     */
    var WorkspaceLayout = Backbone.Marionette.Layout.extend({
        className: 'layout-wrapper',
        template: Handlebars.default.compile(Workspace_tpl),

        regions: {
            screenEditor: "#workspace-screen",
            actionsEditor: "#workspace-actions",
            noteEditor: "#workspace-note"
        }
    });

    return WorkspaceLayout;
});
