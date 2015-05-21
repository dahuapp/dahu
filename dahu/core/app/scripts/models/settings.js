/**
 * Created by barraq on 19/05/14.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone){

    /**
     * Base object model.
     */
    var SettingsModel = Backbone.Model.extend({
        defaults: {
            screenWidth: undefined,
            screenHeight: undefined
        },

        /**
         * Predicate to know if the dimensions were 
         * previously set.
         * 
         * @return {Boolean} true if both screenWidth and screenHeigh are defined
         */
        hasScreenDimension: function() {
            return !((this.screenWidth === undefined) || (this.screenHeight === undefined));
        }
    });

    return SettingsModel;
});
