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

        defaults: {
            'initialScale': 1.0,
            'containment': 'parent'
        },

        initialize: function() {
            var self = this;

            // set default scale
            self.scale = this.getOption('initialScale');

            // listen to workspace scale change events
            events.on('app:workspace:onScaleChanged', function(scale) {
                self.scale = scale;
            });
        },

        onDomRefresh: function() {
            var self = this;

            // set containment
            switch (this.options.containment) {
                case 'window': this.$containment = $(window); break;
                case 'parent': this.$containment = this.$el.parent(); break;
                case 'document': this.$containment = $(document); break;
                default: this.$containment = $(this.options.containment); break;
            }

            // make it draggable
            this.$el.draggable({
                // @warning specifying a 'containment' does not work when used with scale
                // containment: "parent",
                cursor: "move",
                scroll: false,
                drag: function(event, ui) {
                    // patch position with scale and boundaries
                    ui.position.left = Math.min(Math.max(0, ui.position.left / self.scale),
                            self.$containment.width()-ui.helper.outerWidth(true));
                    ui.position.top = Math.min(Math.max(0, ui.position.top / self.scale),
                            self.$containment.height()-ui.helper.outerHeight(true));
                },
                stop: function( event, ui ) {
                    // workout final position (this function is called just after drag.)
                    var left = Math.min(Math.max(0, ui.position.left / self.$containment.width()), 1.0).toFixed(4);
                    var top = Math.min(Math.max(0, ui.position.top / self.$containment.height()), 1.0).toFixed(4);

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