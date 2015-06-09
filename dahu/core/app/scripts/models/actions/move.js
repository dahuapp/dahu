/**
 * Created by dufourau on 6/12/14.
 */
define([
    'underscore',
    'backbone',
    'models/action'
], function(_, Backbone, ActionModel){

    /**
     * Model of move action
     */
    var MoveModel = ActionModel.extend({
        defaults: function() {
            return _.extend({}, ActionModel.prototype.defaults(), {
                type: 'move',
                trX: null,
                trY: null
            });
        }
    });

    return MoveModel;
});