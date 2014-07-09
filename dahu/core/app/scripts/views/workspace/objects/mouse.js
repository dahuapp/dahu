/**
 * Created by dufourau on 6/12/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // views
    'views/common/objects/object',
    // behaviors
    'behaviors/workspace/objects/draggable',
    // templates
    'text!templates/views/workspace/mouse.html'
], function(
    Handlebars,
    Marionette,
    // views
    ObjectView,
    // behaviors
    DraggableBehavior,
    // templates
    mouseTemplate){

    /**
     * Mouse view
     */
    return ObjectView.extend({
        template: Handlebars.default.compile(mouseTemplate),

        className: 'object mouse',

        behaviors: {
            DraggableBehavior: {
                behaviorClass: DraggableBehavior
            }
        },

        onDragCompleted: function(position) {
            this.model.set('posx', position.x);
            this.model.set('posy', position.y);
        }
    });
});
