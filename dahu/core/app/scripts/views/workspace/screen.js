/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/events',
    'modules/requestResponse',
    // models
    'models/objects/image',
    'models/objects/mouse',
    'models/objects/tooltip',
    // views
    'views/common/objects/image',
    'views/workspace/objects/mouse',
    'views/workspace/objects/tooltip',
    // templates
    'text!templates/views/screen.html'
], function(
    Handlebars,
    Marionette,
    // modules
    events,
    reqres,
    // models
    ImageModel,
    MouseModel,
    TooltipModel,
    // view
    ImageView,
    MouseView,
    TooltipView,
    // templates
    screenTemplate){

    /**
     * Workspace screen view
     */
    return Marionette.CompositeView.extend({
        template: Handlebars.default.compile(screenTemplate),

        id : function () { return this.model.get("id"); },
        className: 'screen',
        childViewContainer: '.container',

        initialize : function () {
            // grab the child collection from the parent model
            // so that we can render the collection as children
            // of this parent node
            this.collection = this.model.get('objects');
        },

        // We select the ChildView depending on the object type.
        getChildView: function(item){
            if(item instanceof ImageModel) {
                return ImageView;
            }else if(item instanceof MouseModel){
                return MouseView;
            }else if(item instanceof TooltipModel){
                return TooltipView;
            }
        },

        initialize : function () {
            // Specify that the collection we want to iterate, for the childView, is
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
        }
    });
});