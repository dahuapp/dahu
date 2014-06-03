/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'uuid'
], function(_, Backbone, UUID){

    /**
     * Base action model.
     */
    var ActionModel = Backbone.Model.extend({
        defaults: function() {
            return {
                id: UUID.v4(),
                type: "appear",
                target: "mouse-cursor",
                trigger: "onClick"
            }
        }
    });

    return ActionModel;
});