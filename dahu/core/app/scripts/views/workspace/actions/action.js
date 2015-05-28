/**
 * Created by obzota on 28/5/15.
 */

define([
    'handlebars',
    'backbone.marionette',
    // templates
    'text!templates/views/workspace/actions/action.html'
], function(
    Handlebars,
    Marionette,
    // templates
    actionTemplate
) {

    /**
     * Generic action view
     */
    return Marionette.ItemView.extend({

        template: Handlebars.default.compile(actionTemplate),

        className: "action",

        events: {
            "click .actionDelete": "delete"
        },

        delete: function() {
            this.model.destroy();
        }

    });
});
