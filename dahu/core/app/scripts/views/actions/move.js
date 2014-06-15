/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/move.html'
], function(Handlebars, Marionette, Actions_move_tpl){

    /**
     * Move action view
     */
    var moveView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_move_tpl),

        templateHelpers: {
            isMyTrigger: function(trigger) {
                if (this.trigger == trigger) {
                    return "selected";
                }
            }
        },

        ui: {
            triggerSelector: "select[id=moveTrigger]",
            finalAbsInput: "input[id=moveFinalAbs]",
            finalOrdInput: "input[id=moveFinalOrd]",
            durationInput: "input[id=moveDuration]"
        },

        events: {
            "click .editMove" : "modify"
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
            var finalAbsVal = this.ui.finalAbsInput.val();
            var finalOrdVal = this.ui.finalOrdInput.val();

            if (this.trigger != triggerVal) {
                this.model.set('trigger', triggerVal);
            }
            if (this.duration != durationVal) {
                this.model.set('duration', parseInt(durationVal));
            }
            if (this.finalAbs != finalAbsVal) {
                this.model.set('finalAbs', parseFloat(finalAbsVal));
            }
            if (this.finalOrd != finalOrdVal) {
                this.model.set('finalOrd', parseFloat(finalOrdVal));
            }
        }
    });

    return moveView;
});