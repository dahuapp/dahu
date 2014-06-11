/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/mouse.html',
    'modules/utils/paths'
], function(Handlebars, Marionette, Objetcs_mouse_tpl, Paths){

    /**
     * Screen image view
     */
    var mouseView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Objetcs_mouse_tpl),
        templateHelpers: {
            getAbs: function () {

                return (this.posx)*800 ;
            },
            getOrd: function () {
                return (this.posy)*494;
            },

            cursorFullPath: function() {
                var img = 'Next/dahu/dahu/cursor.png';
                return Paths.getImgFullPath(img);
            }
        }

    });

    return mouseView;
});