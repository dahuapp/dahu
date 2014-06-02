/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/filmstrip/screen.html',
    'models/objects/background',
    'views/objects/background',
    'views/filmstrip/objectDummy'
], function(Handlebars, Marionette, Filmstrip_screen_tpl, BackgroundModel, BackgroundView, ObjectDummyView){

    /**
     * Filmstrip screen view
     */
    var ScreenView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl),
        // We select the ItemView depending on the object type.
        getItemView: function(item){
            if(item instanceof BackgroundModel) {
                return  BackgroundView;
            }
            //@todo handle other types of objects
            else {
                return ObjectDummyView;
            }
        },
        itemViewContainer: '#objects',

        initialize : function () {
            // Specify that the collection we want to iterate, for the itemView, is
            // given by the attribute objects.
            this.collection = this.model.get('objects');
        }
    });

    return ScreenView;
});