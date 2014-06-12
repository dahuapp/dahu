/**
 * Created by dufourau on 6/12/14.
 */
define([
    'handlebars',
    'backbone.marionette',
    'views/objects/object',
    'text!templates/views/workspace/tooltip.html'
], function(Handlebars, Marionette, ObjectView, Objetcs_tooltip_tpl){

    /**
     * Tooltip view
     */
    var tooltipView = ObjectView.extend({
        template: Handlebars.default.compile(Objetcs_tooltip_tpl),

        templateHelpers: {
            getText: function () {
                return this.text;
            }
        }

    });

    return tooltipView;
});