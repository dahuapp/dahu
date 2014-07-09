/**
 * Created by barraq on 26/05/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'fit',
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
    fit,
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

        onShow: function() {
            // setup UI
            var ctrl = reqres.request('app:screencast:controller');

            this.$('.container').css({
                width: ctrl.getScreencastWidth(),
                height: ctrl.getScreencastHeight()
            });

            this.watching = fit(this.$('.container')[0], this.$el[0], {
                hAlign: fit.CENTER,
                vAlign: fit.TOP,
                watch: true,     // refresh on resize
                cover: false     // fit within, do not cover
            }, function( transform, element ) {
                // scale the workspace
                fit.cssTransform(transform, element);
                // notify listener that workspace was scaled
                events.trigger('app:workspace:onScaleChanged', transform.scale);
            });
        },

        onDestroy: function() {
            // turn off watching before destroying the view
            // otherwise the watcher keeps on being notified.
            if( this.watching ) {
                this.watching.off();
            }
        }
    });
});