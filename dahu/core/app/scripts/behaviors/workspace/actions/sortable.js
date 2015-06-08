/**
 * Original source : http://habrahabr.ru/post/220299/ and adapted
 * Explanations in english : http://kukuruku.co/hub/jquery/marionettejs-dragdrop-model-sorting-in-the-collection
 * For more explanation about drag and drop https://api.jqueryui.com/sortable/
 */

define([
    'backbone.marionette'
], function(
    Marionette
) {

    /**
     * Sortable behavior for collections.
     */
    return Marionette.Behavior.extend({

        defaults: {
            'initialScale': 1.0,
            'containment': 'parent'
        },

        onRender: function() {
            // Set containment
            switch (this.options.containment) {
                case 'window': this.$containment = $(window); break;
                case 'parent': this.$containment = this.$el.parent(); break;
                case 'document': this.$containment = $(document); break;
                default: this.$containment = $(this.options.containment); break;
            }

            // Close the collection
            var collection = this.view.collection;

            // Get the list of  child elements
            var items = this.view.children._views;

            var view;
            for(var v in items) {
                view = items[v];
                // Hook the element to the model by cid
                // to identify it when we will drag and drop it
                view.$el.attr('data-backbone-cid', view.model.cid);
            }

            // Make the list sortable
            this.view.$childViewContainer.sortable({
                // Initialize the list with attributes to handle drag and drop
                axis: this.view.options.axis || false,

                grid: this.view.options.grid || false,

                containment: this.view.options.containment || false,

                cursor: "move",

                handle: this.view.options.handle || false,

                revert: this.view.options.revert || false,

                update: function(event, ui) {
                    // Get an attached model
                    var model = collection.get(ui.item.data('backbone-cid'));

                     // On the quiet remove it from the collection
                    collection.remove(model, {silent:true});

                     //And sneakily add it to the necessary index
                    collection.add(model, {at:ui.item.index(), silent:true});
                }
            });
        }
    });
});