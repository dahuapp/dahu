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
            id: null,
            objects: null
        },

        initialize: function () {
            this.set('id', this.get('id') || UUID.v4());
            this.set('objects', this.get('objects') || new ObjectCollection());
        }
    });

    return ScreenModel;
});