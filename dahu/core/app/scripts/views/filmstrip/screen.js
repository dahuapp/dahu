/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/events',
    // models
    'models/objects/image',
    // views
    'views/common/objects/image',
    // templates
    'text!templates/views/screen.html'
], function(
    Handlebars,
    Marionette,
    // modules
    events,
    // models
    ImageModel,
    ImageView,
    // templates
    screenTemplate){

    /**
     * Filmstrip screen view
     */
    return Marionette.CompositeView.extend({
        template: Handlebars.default.compile(screenTemplate),

        id : function () { return this.model.get("id"); },
        className: 'screen',
        childViewContainer: '.container',

        events: {
            "click": "display"
        },

        initialize : function () {
            this.collection = this.model.get('objects');
        },

        // Select the ItemView depending on the object type.
        getChildView: function(item){
            if(item instanceof ImageModel) {
                return  ImageView;
            }
        },

        // Only show object of type 'image'
        addChild: function(item, ItemView, index){
            if ( item instanceof ImageModel ) {
                Marionette.CompositeView.prototype.addChild.apply(this, arguments);
            }
        },

        display: function(event){
            events.trigger('app:filmstrip:onScreenSelected', this.model.get('id'));
        }
    });
});