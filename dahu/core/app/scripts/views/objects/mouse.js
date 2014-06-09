/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/mouse.html',
    'models/actions/move'
], function(Handlebars, Marionette, Objetcs_mouse_tpl){

    /**
     * Screen image view
     */
    var mouseView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Objetcs_mouse_tpl),
        templateHelpers: {
            getAbs: function () {

                return (this.posx)*500 ;
            },
            getOrd: function () {
                return (this.posy)*500;
            }
        }

    });

    return mouseView;
});