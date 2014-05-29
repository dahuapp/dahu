define([
    'underscore',
    'backbone',
    'uuid'
], function(_, Backbone, UUID){

    /**
     * Base object model.
     */
    var ObjectModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4()
            }
        }
    });

    return ObjectModel;
});