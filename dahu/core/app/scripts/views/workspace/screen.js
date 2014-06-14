/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/screen.html',
    'models/objects/image',
    'models/objects/mouse',
    'models/objects/tooltip',
    'views/objects/image',
    'views/objects/mouse',
    'views/objects/tooltip',
    'views/objects/object'
], function(Handlebars, Marionette, Filmstrip_screen_tpl, ImageModel, MouseModel, TooltipModel, ImageView, MouseView, TooltipView, ObjectView){

    /**
     * Workspace screen view
     */
    var ScreenView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl),
        // We select the ItemView depending on the object type.
        getItemView: function(item){
            if(item instanceof ImageModel) {
                return ImageView;
            }else if(item instanceof MouseModel){
                return MouseView;
            }else if(item instanceof TooltipModel){
                return TooltipView;
            }else{
                return ObjectView;
            }

        },
        itemViewContainer: '#objects',

        initialize : function () {
            // Specify that the collection we want to iterate, for the itemView, is
            // given by the attribute objects.
            if (this.model != null && this.model != undefined) {
                this.collection = this.model.get('objects');
                // Tell the view to render itself when the
                // model/collection is changed.
                this.model.on('change', this.onChanged(), this);
                if (this.collection != null) {
                    this.collection.on('change', this.onChanged(), this);
                }
            }
        },

        onChanged: function(){
            this.render();
        },

        modelEvents: {
            'change': 'onChanged'
        }
    });

    return ScreenView;
});