/**
 * Created by nabilbenabbou1 on 6/14/14.
 */

define([
    'backbone.marionette',
    // views
    'views/workspace/screen',
    'views/workspace/actions',
    'modules/kernel/SCI'
], function (Marionette,
             ScreenView, ActionsView) {

    /**
     * Workspacelayout controller
     */
    var WorkspacelayoutController = Marionette.Controller.extend({

        /**
         * Show the model in corresponding views inside the layout
         * @param layout : where to show the model
         * @param screenModel : the screen model to show
         */
        showAllInLayout: function(layout, screenModel) {
            // the shown model in the workspace
            this.screenModel = screenModel;
            if (screenModel == null || screenModel == undefined) {
                layout.screenEditor.show(new ScreenView());
                layout.actionsEditor.show(new ActionsView());
            }
            else {
                layout.screenEditor.show(new ScreenView({model : screenModel}));
                layout.actionsEditor.show(new ActionsView({model : screenModel}));
            }
        },

        getCurrentScreen: function() {
            return this.screenModel;
        }
    });

    return WorkspacelayoutController;

});