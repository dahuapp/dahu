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
        defaults: function() {
            return {
                id: UUID.v4(),
                objects: new ObjectCollection()
            }
        },

        initialize: function () {
            // wrap up objects around ObjectCollection unless it already is
            if ( ! (this.get('objects') instanceof ObjectCollection) ) {
                this.set('objects', new ObjectCollection(this.get('objects')));
            }
        }
    });

    return ScreenModel;
});