/**
 * Created by nabilbenabbou1 on 6/13/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    'text!templates/views/workspace/actions/appear.html'
], function(Handlebars, Marionette, Actions_appear_tpl){

    /**
     * Appear action view
     */
    var appearView = Marionette.ItemView.extend({
        template: Handlebars.default.compile(Actions_appear_tpl),

        templateHelpers: {
            isMyTrigger: function(trigger) {
                if (this.trigger == trigger) {
                    return "selected";
                }
            },
            hasSpeedAndDelayAfter: function() {
                // we show the speed and delayAfter inputs only when the
                // trigger is afterPrevious
                if (this.trigger != "afterPrevious") {
                    return "hidden";
                }
            }
        },

        ui: {
            triggerSelector: "select[id=appearTrigger]",
            speedInput: "input[id=appearSpeed]",
            durationInput: "input[id=appearDuration]",
            delayAfterInput: "input[id=appearDelayAfter]"
        },

        events: {
            "click .editAppear" : "modify"
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
            var speedVal = this.ui.speedInput.val();
            var delayAfterVal = this.ui.delayAfterInput.val();

            if (this.trigger != triggerVal) {
                this.model.set('trigger', triggerVal);
            }
            if (this.duration != durationVal) {
                this.model.set('duration', parseInt(durationVal));
            }
            if (this.speed != speedVal) {
                this.model.set('speed', parseFloat(speedVal));
            }
            if (this.delayAfter != delayAfterVal) {
                this.model.set('delayAfter', parseInt(delayAfterVal));
            }
        }
    });

    return appearView;
});