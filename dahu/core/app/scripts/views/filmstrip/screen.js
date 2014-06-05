/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/screen.html',
    'models/objects/background',
    'views/filmstrip/background',
    'modules/events'
], function(Handlebars, Marionette, Filmstrip_screen_tpl, BackgroundModel, BackgroundView, events){

    /**
     * Filmstrip screen view
     */
    var ScreenView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl),
        itemViewContainer: '#objects',

        // Select the ItemView depending on the object type.
        getItemView: function(item) {
            if (item instanceof BackgroundModel) {
                return  BackgroundView;
            }
        },
        // Only show object of type 'background'
        addItemView: function(item, ItemView, index){
            if ( item instanceof BackgroundModel ) {
                Backbone.Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
            }
        },

        initialize : function () {
            // Specify that the collection we want to iterate, for the itemView, is
            // given by the attribute objects.
            this.collection = this.model.get('objects');
        },

        // Detect a click on the screen div
        events: {
            "click .screen": "display"
        },

        display: function(event){
            events.trigger('app:filmstrip:onScreenSelected', this.model);
        }
    });

    return ScreenView;
});