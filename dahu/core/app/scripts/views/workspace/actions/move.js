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
    'text!templates/views/workspace/actions/move.html'
], function(
    Handlebars,
    Marionette,
    // views
    ActionView,
    // templates
    actionTemplate,
    moveTemplate
) {
    
    /**
     * Move action view
     */
    return ActionView.extend({

        initialize: function (options) {
            ActionView.prototype.initialize.call(this, options);
            Handlebars.registerPartial("moveParametersPartial", Handlebars.default.compile(moveTemplate));
        },

        triggers: function () {
            return _.extend({}, ActionView.prototype.triggers,{
                "change #trXChoice": "move:trx:change",
                "change #trYChoice": "move:try:change"
            });
        },

        hasExtraParameters: true,

        onMoveTrxChange: function () {
            this.model.attributes.trX = $("#trXChoice").val();
        },

        onMoveTryChange: function () {
            this.model.attributes.trY = $("#trYChoice").val();
        }
    });
});