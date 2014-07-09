define([
    'underscore',
    'backbone',
    'uuid'
], function(_, Backbone, UUID){

    /**
     * Base object model.
     *
     * @important please prefer using *CSS property name* when object properties are related to CSS property.
     * For instance instead of naming the x position of an object *posx* call it *left* instead...
     */
    var ObjectModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                type: 'unknown',
                /* @todo rename it to "left" */ posx: 0,
                /* @todo rename it to "top" */ posy: 0
            }
        },

        initialize: function () {
            // define a is{Type} function.
            this["is"+this.get("type").charAt(0).toUpperCase() + this.get("type").substring(1)] = function() {
                return true;
            };
        }
    });

    return ObjectModel;
});