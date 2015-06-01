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
    'text!templates/views/workspace/actions/disappear.html'
], function(
    Handlebars,
    Marionette,
    // views
    ActionView,
    // templates
    actionTemplate,
    disappearTemplate
) {
    
    /**
     * Disappear action view
     */
    return ActionView.extend({

        initialize: function (options) {
            ActionView.prototype.initialize.call(this, options);
            Handlebars.registerPartial("disappearParametersPartial", Handlebars.default.compile(disappearTemplate));
        }
    });
});