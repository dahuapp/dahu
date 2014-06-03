/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'models/object'
], function(_, Backbone, ObjectModel){

    /**
     *  Model of tooltip object
     */
    var TooltipModel = ObjectModel.extend({
        defaults: {
            type: 'tooltip',
            text: null,
            color: null,
            width: null
        }
    });

    return TooltipModel;
});