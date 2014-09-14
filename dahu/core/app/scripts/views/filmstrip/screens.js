/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // views
    'views/filmstrip/screen'
], function(
    Handlebars, Marionette,
    // views
    FilmstripScreenView){

    /**
     * Filmstrip screen view
     */
    return Marionette.CollectionView.extend({

        id: 'filmstrip-screens',
        childView: FilmstripScreenView,

        initialize: function(options) {
            _.extend(this, _.pick(options, ['screencast']));

            // we render screens collection from screencast model.
            this.collection = this.screencast.model.get('screens');
        },

        /**
         * Redefinition of methods to take into consideration the new parameter
         * item in getItemView, that we redefined in FilmStripScreenView.
         */
        addChildView: function(item, collection, options){
            this.destroyEmptyView();
            var ChildView = this.getChildView(item);
            return this.addChild(item, ChildView, options.index);
        },

        showCollection: function(){
            var self = this;
            this.collection.each(function(item, index){
                var ChildView = self.getChildView(item);
                self.addChild(item, ChildView, index);
            });
        }
    });
});
