define([
    'underscore',
    'backbone',
    'uuid',
    'collections/objects'
], function(_, Backbone, UUID, ObjectCollection){

    /**
     * Base Screen model.
     */
    var ScreenModel = Backbone.Model.extend({
        defaults: {
            id: UUID.v4(),
            objects: new ObjectCollection()
        }
    });

    return ScreenModel;
});