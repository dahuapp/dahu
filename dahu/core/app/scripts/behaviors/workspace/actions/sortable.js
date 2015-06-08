/**
 * Original source : http://habrahabr.ru/post/220299/ and adapted
 * Explanations in english : http://kukuruku.co/hub/jquery/marionettejs-dragdrop-model-sorting-in-the-collection
 */

define([
    'backbone.marionette',
    // modules
    'modules/events',
    'modules/requestResponse',
    // extra
    'jquery-ui'
], function(Marionette, events, reqres) {

    /**
     * Sortable behavior for collections.
     */
    return Marionette.Behavior.extend({ 
        onRender:function(){
            var  collection=this.view.collection // Close the collection
                ,items=this.view.children._views // Get the list of  child elements 
                ,view
                ;
            for(var v in items){
                view=items[v];
                // Hook the element to the model by cid
                view.$el.attr('data-backbone-cid', view.model.cid);
            }
            this.view.$childViewContainer.sortable({ // Make the list sortable
                axis: this.view.options.axis||false,
                grid: this.view.options.grid||false,
                containment: this.view.options.containment||false,
                cursor: "move",
                handle:this.view.options.handle||false,
                revert: this.view.options.revert||false,
                update: function( event, ui ) {
                    var model=collection.get(ui.item.data('backbone-cid')); 
                    // Get an attached model 
                    collection.remove(model,{silent:true});
                     // On the quiet remove it from the collection 
                    collection.add(model,{at:ui.item.index(),silent:true});
                     //And sneakily add it to the necessary index
                }
            });
        }
    });
});