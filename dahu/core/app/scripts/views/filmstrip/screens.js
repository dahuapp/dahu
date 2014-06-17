/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'views/filmstrip/screen'
], function(Handlebars, Marionette, FilmstripScreenView){

    /**
     * Filmstrip screen view
     */
    var ScreensView = Marionette.CollectionView.extend({

        id: 'filmstrip-screens',
        itemView: FilmstripScreenView,

        /**
         * Redefinition of methods to take into consideration the new parameter
         * item in getItemView, that we redefined in FilmStripScreenView.
         */
        addChildView: function(item, collection, options){
            this.closeEmptyView();
            var ItemView = this.getItemView(item);
            return this.addItemView(item, ItemView, options.index);
        },

        showCollection: function(){
            var that = this;
            this.collection.each(function(item, index){
                var ItemView = that.getItemView(item);
                that.addItemView(item, ItemView, index);
            });
        }

    });

    return ScreensView;
});