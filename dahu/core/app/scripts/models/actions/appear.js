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
        defaults: {
            type: 'appear',
            target:null,
            trigger: null,
            duration: null
        }

    });

    return AppearModel;
});