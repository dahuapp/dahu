/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone){

    /**
     * Base action model.
     */
    var ActionModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: null
            }
        }
    });

    return ActionModel;
});