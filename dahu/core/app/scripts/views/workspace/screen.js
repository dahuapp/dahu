/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/screen.html',
    'models/objects/image',
    'models/objects/mouse',
    'views/workspace/image',
    'views/objects/mouse',
    'views/objects/tooltip'
], function(Handlebars, Marionette, Filmstrip_screen_tpl, ImageModel, MouseModel, ImageView, MouseView, TooltipView){

    /**
     * Filmstrip screen view
     */
    var ScreenView = Marionette.CompositeView.extend({
        template: Handlebars.default.compile(Filmstrip_screen_tpl),
        // We select the ItemView depending on the object type.
        getItemView: function(item){
            if(item instanceof ImageModel) {
                return  ImageView;
            }
            else if(item instanceof MouseModel){
                return MouseView;
            }
            else{
                return TooltipView;
            }
        },
        itemViewContainer: '#objects',

        initialize : function () {
            // Specify that the collection we want to iterate, for the itemView, is
            // given by the attribute objects.
            this.collection = this.model.get('objects');
            // Tell the view to render itself when the
            // model/collection is changed.
            this.model.on('change', this.onChanged(), this);
            this.collection.on('change', this.onChanged(), this);
        },

        setModel: function(newModel){
            this.model = newModel;
            this.collection = newModel.get('objects');
            this.onChanged();
        },

        onChanged: function(){
            this.render();
        }
    });

    return ScreenView;
});