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

            // remove previous
            if( self.$el.resizable() ){
                self.$el.resizable('destroy');
            }

            // make it resizable (again)
            self.$el.resizable({
                stop: function( event, ui ) {
                    // workout final size (@todo translate it to %)
                    var width = Math.min(Math.max(0, ui.size.width), self.$containment.width());
                    var height = Math.min(Math.max(0, ui.size.height), self.$containment.height());

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