/**
 * Created by dufourau on 6/10/14.
 */

define([
    'underscore',
    'backbone',
    'models/action'
], function(_, Backbone, ActionModel){

    /**
     * Model of appear action
     */
    var AppearModel = ActionModel.extend({
        defaults: function() {
            return _.extend({}, ActionModel.prototype.defaults(), {
                type: 'appear'
            });
        }
    });

    return AppearModel;
});