/**
 * Created by barraq on 7/8/14.
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
     * Draggable behavior for draggable objects located in the workspace.
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

            // make it draggable
            this.$el.draggable({
                // @warning specifying a 'containment' does not work when used with scale
                // containment: "parent",
                cursor: "move",
                scroll: false,
                drag: function(event, ui) {
                    // patch position with scale and boundaries
                    ui.position.left = Math.min(Math.max(0, ui.position.left / self.scale),
                            self.screencastWidth-ui.helper.outerWidth(true));
                    ui.position.top = Math.min(Math.max(0, ui.position.top / self.scale),
                            self.screencastHeight-ui.helper.outerHeight(true));
                },
                stop: function( event, ui ) {
                    // workout final position (this function is called just after drag.)
                    var left = Math.min(Math.max(0, ui.position.left / self.screencastWidth), 1.0).toFixed(4);
                    var top = Math.min(Math.max(0, ui.position.top / self.screencastHeight), 1.0).toFixed(4);

                    // notify that drag is completed
                    self.view.triggerMethod('drag:completed', {
                        x: left,
                        y: top
                    });
                }
            });
        }
    });

    return ResizableBehavior;
});