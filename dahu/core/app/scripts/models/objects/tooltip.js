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
            text: "",
            color: "#FFFFDD",
            width: "240px",
            posx: 0.3,
            posy: 0.3
        },

        modifyText: function(newText) {
            this.set('text', newText);
        }
    });

    return TooltipModel;
});