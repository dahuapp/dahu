/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'uuid'
], function(_, Backbone, UUID){

    /**
     * Base action model.
     */
    var ActionModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                target: null,
                trigger: null,
                duration: 0,
                type: null
            };
        },

        initialise: function () {
            // define a is{Type} function.
            this["is"+this.get("type").charAt(0).toUpperCase() + this.get("type").substring(1)] = function() {
                return true;
            };
        }

    });

    return ActionModel;
});