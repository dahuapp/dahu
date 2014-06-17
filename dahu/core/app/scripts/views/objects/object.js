/**
 * Created by nabilbenabbou1 on 28/05/2014.
 */

define([
    'handlebars',
    'backbone.marionette'
], function(Handlebars, Marionette){

    /**
     * Object general view
     */
    var objectView = Marionette.ItemView.extend({

        modelEvents: {
            'change': 'render'
        },

        onRender: function() {
            this.updateCSS();
        },

        updateCSS: function() {
            // set position of the object every time it is rendered.
            // @todo handle the case where we are dragging this object.
            this.$el.css({
                'top': this.model.get('posy')*100+"%",
                'left': this.model.get('posx')*100+"%"
            });
        }
    });

    return objectView;
});
