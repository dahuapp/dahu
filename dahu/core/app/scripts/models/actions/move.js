/**
 * Created by dufourau on 6/5/14.
 */
/**
 * Created by dufourau on 6/5/14.
 */
define([
    'underscore',
    'backbone',
    'models/action'
], function(_, Backbone, ActionModel){

    /**
     *  Model of background object
     */
    var BackgroundModel = ActionModel.extend({
        defaults: {
            type: 'move',
            target:'mouse-cursor',
            trigger: null,
            finalAbs: null,
            finalOrd: null
        }

    });

    return BackgroundModel;
});