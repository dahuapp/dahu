/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'underscore',
    'backbone.marionette',
    // modules
    'modules/requestResponse'
], function(_, Marionette, reqres){

    var CSS_PROPERTIES = ['left', 'top', 'width', 'height'];

    /**
     * Base class for all 'object' views.
     */
    return Marionette.ItemView.extend({

        initialize: function() {
            var ctrl = reqres.request('app:screencast:controller');

            // get screencast with and height
            // if those values change the view will be recreated therefore we don't need to listen for changes
            this.screencastWidth = ctrl.getScreencastWidth();
            this.screencastHeight = ctrl.getScreencastHeight();
        },

        /**
         * Automatically set CSS properties when the DOM is refreshed.
         * All CSS compliant properties found in the associated model are used for styling.
         */
        onDomRefresh: function() {
            var self = this;
            var style = {};

            // handle posx (@todo rename property in left)
            if( this.model.has('posx')) {
                style['left'] = (this.model.get('posx') * this.screencastWidth) + "px";
            }

            // handle posy (@todo rename propety in top)
            if( this.model.has('posy')) {
                style['top'] = (this.model.get('posy') * this.screencastHeight) + "px";
            }

            // handle all CSS properties
            _.each(_.keys(this.model.attributes), function(property) {
                if( _.contains(CSS_PROPERTIES, property) ) {
                    style[property] = self.model.get(property);
                }
            });

            // set computed style
            this.$el.css(style);
        }
    });
});
