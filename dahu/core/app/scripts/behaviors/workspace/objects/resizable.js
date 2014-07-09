/**
 * Created by barraq on 02/07/14.
 */

define([
    'backbone.marionette',
    // modules
    'modules/events',
    'modules/requestResponse',
    // extra
    'jquery-ui'
], function(Marionette, events, reqres) {

    /**
     * Resizable behavior for resizable objects located in the workspace.
     */
    return Marionette.Behavior.extend({

        initialize: function() {
            var self = this;
            var ctrl = reqres.request('app:screencast:controller');

            // set default scale
            self.scale = 1.0;

            // listen to workspace scale change events
            events.on('app:workspace:onScaleChanged', function(scale) {
                self.scale = scale;
            });

            // get screencast with and height
            // if those values change everything will be recreated therefore we don't need to listen for changes
            self.screencastWidth = ctrl.getScreencastWidth();
            self.screencastHeight = ctrl.getScreencastHeight();
        },

        onDomRefresh: function() {
            var self = this;

            // remove previous
            if( self.$el.resizable() ){
                self.$el.resizable('destroy');
            }

            // make it resizable (again)
            self.$el.resizable({
                stop: function( event, ui ) {
                    // workout final size (@todo translate it to %)
                    var width = Math.min(Math.max(0, ui.size.width), self.screencastWidth);
                    var height = Math.min(Math.max(0, ui.size.height), self.screencastHeight);

                    // notify that resize is completed
                    self.view.triggerMethod('resize:completed', {
                        width: width,
                        height: height
                    });
                }
            });
        }
    });
});