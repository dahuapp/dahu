/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // views
    'views/filmstrip/screen'
], function(Handlebars, Marionette, FilmstripScreenView){

    /**
     * Filmstrip screen view
     */
    return Marionette.CollectionView.extend({

        id: 'filmstrip-screens',
        childView: FilmstripScreenView,

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
            var that = this;
            this.collection.each(function(item, index){
                var ChildView = that.getChildView(item);
                that.addChild(item, ChildView, index);
            });
        }

    });
});
