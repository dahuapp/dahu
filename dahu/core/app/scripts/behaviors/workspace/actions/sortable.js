/**
 * Created by coutinju on 6/14/15.
 */

define([
    'backbone.marionette'
], function(
    Marionette
) {
    /**
     * Sortable behavior for composite views.
     */
    return Marionette.Behavior.extend({
        /*
         * When the view is empty this.view.$childViewContainer is undefined.
         * We need to check if the behavior is defined because it might be
         * the first childView to be added in the childViewContainer.
         */
        onChildviewDomRefresh: function() {
            // Either childViewContainer is defined or not
            var list = this.view.$childViewContainer || this.$el;

            if(list.attr("sortable"))
                return;

            var collection = this.view.collection;

            // Make the list sortable
            list.sortable({
                update: function(event, ui) {
                    // Get an attached model
                    var model = collection.get(ui.item.data('backbone-cid'));

                    // On the quiet remove it from the collection
                    collection.remove(model, {silent:true});

                     //And sneakily add it to the necessary index
                    collection.add(model, {at:ui.item.index(), silent:true});
                }
            });
        },

        onAddChild: function(view) {
            /*
             * We add as attribute the cid attribute of backbone to identify
             * each view when the user drags and drops it.
             */
            view.$el.attr('data-backbone-cid', view.model.cid);
        }
    });
});