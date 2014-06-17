/**
 * Created by dufourau on 6/12/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'modules/events',
    'views/objects/object',
    'text!templates/views/workspace/tooltip.html'
], function(Handlebars, Marionette, events, ObjectView, Objetcs_tooltip_tpl){

    /**
     * Tooltip view
     */
    var tooltipView = ObjectView.extend({
        template: Handlebars.default.compile(Objetcs_tooltip_tpl),

        draggable: true,
        className: 'object tooltip',

        templateHelpers: {
            getText: function () {
                return this.text;
            }
        },

        events: {
            "click": "edit"
        },

        modelEvents: {
            'change': 'fieldsChanged'
        },

        updateCSS: function() {
            // call super onRender
            ObjectView.prototype.updateCSS.call(this);

            // set position of the object every time it is rendered.
            // @todo handle the case where we are dragging this object.
            // @todo move width and height in % (see #91)
            this.$el.css({
                'width': this.model.get('width'),
                'height': this.model.get('height') || 'auto',
                // @todo remove this and put it as a property in model.
                'z-index': 10
            });
        },

        edit: function(event) {
            events.trigger('app:workspace:tooltips:edit', this.model);
        },

        fieldsChanged: function() {
            this.render();
        }
    });

    return tooltipView;
});
