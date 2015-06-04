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
        defaults: function() {
            return _.extend({}, ObjectModel.prototype.defaults(), {
                type: 'tooltip',
                text: "",
                //@todo use only %, see #91
                width: "240px",
                color: "#FFFFFF"
            });
        },

        modifyText: function(newText) {
            this.set('text', newText);
        }
    });

    return TooltipModel;
});