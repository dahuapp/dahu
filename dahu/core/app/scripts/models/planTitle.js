/**
 * Created by nabilbenabbou1 on 6/15/14.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone){

    /**
     * Plan title model.
     */
    var PlanTitle = Backbone.Model.extend({
        defaults: {
            text: null,
            type: "h1"
        }
    });

    return PlanTitle;
});