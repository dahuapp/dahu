define([
    'underscore',
    'backbone',
    'uuid'
], function(_, Backbone, UUID){

    /**
     * Base Screen model.
     */
    var ScreenModel = Backbone.Model.extend({
        defaults: {
            id: UUID.v4()
        }
    });

    return ScreenModel;
});