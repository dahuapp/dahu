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

        templateHelpers: {
            getText: function () {
                return this.text;
            }
        },

        events: {
            "click .editTooltip": "edit",
            "click" : "objectSelected"
        },

        edit: function(event) {
            events.trigger('app:workspace:tooltips:edit', this.model);
        },

        modelEvents: {
            'change': 'fieldsChanged'
        },

        fieldsChanged: function() {
            this.render();
        }

    });

    return tooltipView;
});