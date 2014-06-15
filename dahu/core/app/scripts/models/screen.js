define([
    'underscore',
    'backbone',
    'uuid',
    'collections/objects',
    'collections/actions',
    'collections/planTitles'
], function(_, Backbone, UUID, ObjectCollection, ActionsCollection, PlanTitlesCollection){

    /**
     * Base Screen model.
     */
    var ScreenModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                objects: new ObjectCollection(),
                actions : new ActionsCollection(),
                titles: new PlanTitlesCollection()
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
            // wrap up actions around PlanTitlesCollection unless it already is
            if ( ! (this.get('titles') instanceof PlanTitlesCollection) ) {
                this.set('titles', new PlanTitlesCollection(this.get('titles')));
            }
        }
    });

    return ScreenModel;
});