define([
    'underscore',
    'backbone',
    'uuid',
    'collections/objects',
    'collections/actions'
], function(_, Backbone, UUID, ObjectCollection, ActionsCollection){

    /**
     * Base Screen model.
     */
    var ScreenModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                objects: new ObjectCollection(),
                actions : new ActionsCollection()
            }
        },

        initialize: function () {
            // wrap up objects around ObjectCollection unless it already is
            if ( ! (this.get('objects') instanceof ObjectCollection) ) {
                this.set('objects', new ObjectCollection(this.get('objects')));
            }
            // wrap up actions around ActionsCollection unless it already is
            if ( ! (this.get('actions') instanceof ActionsCollection) ) {
                this.set('actions', new ActionsCollection(this.get('actions')));
            }
        }
    });

    return ScreenModel;
});