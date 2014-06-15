/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/disappear.html'
], function(Handlebars, Marionette, Actions_disappear_tpl){

    /**
     * Disappear action view
     */
    var disappearView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_disappear_tpl),

        templateHelpers: {
            isMyTrigger: function(trigger) {
                if (this.trigger == trigger) {
                    return "selected";
                }
            }
        },

        ui: {
            triggerSelector: "select[id=disappearTrigger]",
            durationInput: "input[id=disappearDuration]"
        },

        events: {
            "click .editDisappear" : "modify"
        },

        modelEvents: {
            'change': 'fieldsChanged'
        },

        fieldsChanged: function() {
            this.render();
        },

        modify: function() {
            var triggerVal = this.ui.triggerSelector.val();
            var durationVal = this.ui.durationInput.val();
            if (this.trigger != triggerVal) {
                this.model.set('trigger', triggerVal);
            }
            if (this.duration != durationVal) {
                this.model.set('duration', parseInt(durationVal));
            }
        }
    });

    return disappearView;
});