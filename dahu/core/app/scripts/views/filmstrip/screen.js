/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/screen.html',
    'models/objects/image',
    'views/objects/image',
    'modules/events'
], function(Handlebars, Marionette, Filmstrip_screen_tpl, ImageModel, ImageView, events){

    /**
     * Filmstrip screen view
     */
    var ScreenView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl),

        id : function () { return this.model.get("id"); },
        className: 'screen',
        childViewContainer: '#objects',

        // Select the ItemView depending on the object type.
        getChildView: function(item){
            if(item instanceof ImageModel) {
                return  ImageView;
            }
        },

        // Only show object of type 'image'
        addChild: function(item, ItemView, index){
            if ( item instanceof ImageModel ) {
                Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },

        initialize : function () {
            // Specify that the collection we want to iterate, for the childView, is
            // given by the attribute objects.
            if (this.model != null) {
                this.collection = this.model.get('objects');
            }
        },

        // Detect a click on the screen div
        events: {
            "click": "display"
        },

        display: function(event){
            events.trigger('app:filmstrip:onScreenSelected', this.model);
        }
    });

    return ScreenView;
});