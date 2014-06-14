/**
 * Created by nabilbenabbou1 on 6/1/14.
 */

define([
    'underscore',
    'backbone',
    'models/object',
    'uuid'
], function(_, Backbone, ObjectModel, UUID){

    /**
     *  Model of tooltip object
     */
    var TooltipModel = ObjectModel.extend({
        defaults: function(){
            return {
                id: UUID.v4(),
                type: 'tooltip',
                text: "",
                color: "#FFFFDD",
                width: "240px",
                posx: 0.3,
                posy: 0.3
            }
        },

        modifyText: function(newText) {
            this.set('text', newText);
        }
    });

    return TooltipModel;
});