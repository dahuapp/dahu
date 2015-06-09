/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // views
    'views/workspace/actions/action',
    // templates
    'text!templates/views/workspace/actions/move.html'
], function(
    Handlebars,
    Marionette,
    // views
    ActionView,
    // templates
    moveTemplate
) {

    var ExtraParamView = Marionette.ItemView.extend({

        template: Handlebars.default.compile(moveTemplate),

        initialize: function (model) {
            this.model = model;
        },

        triggers: {
            "change .trXChoice": "move:trx:change",
            "change .trYChoice": "move:try:change"
        }
    });

    /**
     * Move action view
     */
    return ActionView.extend({

        initialize: function (options) {
            ActionView.prototype.initialize.apply(this, arguments);
            this.extraView = new ExtraParamView(this.model);
        },

        onChildviewMoveTrxChange: function () {
            var id = "#trXChoice_" + this.model.id;
            var value = parseInt($(id).val());
            if (!_.isNaN(value)) {
                this.model.set('trX', value);
            } else {
                throw new Exceptions.IOError("Translation X input is NaN");
            }
        },

        onChildviewMoveTryChange: function () {
            var id = "#trYChoice_" + this.model.id;
            var value = parseInt($(id).val());
            if (!_.isNaN(value)) {
                this.model.set('trY',value);
            } else {
                throw new Exceptions.IOError("Translation Y input is NaN");
            }
        },

        onRender: function () {
            this.getRegion('extra').show(this.extraView);
        },

    });
});