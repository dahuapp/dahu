/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // views
    'views/workspace/actions/action',
    // templates
    'text!templates/views/workspace/actions/action.html',
    'text!templates/views/workspace/actions/appear.html'
], function(
    Handlebars,
    Marionette,
    // views
    ActionView,
    // templates
    actionTemplate,
    appearTemplate
) {
    
    /**
     * Appear action view
     */
    return ActionView.extend({

        initialize: function (options) {
            ActionView.prototype.initialize.call(this, options);
            Handlebars.registerPartial("appearParametersPartial", Handlebars.default.compile(appearTemplate));
        }
    });
});