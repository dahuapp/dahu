define([
    // librairies
    'underscore',
    'backbone',
    'uuid',
    // models
    'models/objects/tooltip',
    'models/note',
    // collections
    'collections/objects',
    'collections/actions'
], function(_, Backbone, UUID, // libraries
            TooltipModel, NoteModel,// models
            ObjectCollection, ActionsCollection // collections
){

    /**
     * Base Screen model.
     */
    var ScreenModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                objects: new ObjectCollection(),
                actions : new ActionsCollection(),
                note : new NoteModel()
            };
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
            if ( ! (this.get('note') instanceof NoteModel) ) {
                this.set('note', new NoteModel(this.get('note')));
            }
        },

        /**
         * Get an object model by its `id`.
         *
         * @param objectId
         * @returns {*} Returns the model associated to the `id` if found, else undefined.
         */
        getObjectById: function(objectId) {
            return this.get('objects').findWhere({ id: objectId});
        },

        /**
         * Get a tooltip model by its `id`.
         *
         * @param tooltipId
         * @returns {*} Returns the TooltipModel if found, else undefined.
         */
        getTooltipById: function(tooltipId) {
            var object = this.getObjectById(tooltipId);
            if (object instanceof  TooltipModel) {
                return object;
            } else {
                return undefined;
            }
        },

        /**
         * Add `tooltip`.
         *
         * @param tooltip Tooltip model to add.
         */
        addTooltip: function(tooltip) {
            if (tooltip instanceof TooltipModel) {
                this.get('objects').add(tooltip);
            }
        },

        /**
         * Create a new tooltip from a given `text` and add it to the screen.
         */
        createAndAddTooltipFromText: function(text) {
            this.addTooltip(new TooltipModel({text : text}));
        },

        /**
         * Update tooltip of if `tooltipId` with given `attributes`.
         *
         * @param tooltipId
         * @param attributes Key,value map of attributes to update.
         */
        updateTooltip: function(tooltipId, attributes) {
            var tooltip = this.getTooltipById(tooltipId);
            if (tooltip) {
                // pick only specifi attributes (here only text)
                tooltip.set(_.pick(attributes, ['text']));
            }
        }
    });

    return ScreenModel;
});