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
        defaults: {
            type: 'move',
            target:'mouse-cursor',
            trigger: null,
            finalAbs: null,
            finalOrd: null
        }

    });

    return MoveModel;
});