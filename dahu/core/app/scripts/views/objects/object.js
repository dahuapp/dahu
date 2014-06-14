/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'modules/requestResponse'
], function(Handlebars, Marionette, ReqResponse){

    /**
     * Object general view
     */
    var objectView = Marionette.ItemView.extend({
        events: {
            "click" : "objectSelected"
        },

        objectSelected: function() {
            var workspaceController = ReqResponse.request('app:workspace:layout:controller');
            if (this.model != undefined) {
                workspaceController.showActions(this.model.get('id'));
            }
        }
    });

    return objectView;
});