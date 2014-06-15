/**
 * Created by nabilbenabbou1 on 6/15/14.
 */

define([
    'underscore',
    'backbone',
    'models/planTitle'
], function(_, Backbone, PlanTitle){

    /**
     * Plan Titles collection.
     */
    var PlanTitleCollection = Backbone.Collection.extend({
        model: PlanTitle
    });

    return PlanTitleCollection;
});