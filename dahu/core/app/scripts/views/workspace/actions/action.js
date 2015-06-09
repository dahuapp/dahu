/**
 * Created by obzota on 28/5/15.
 */

define([
    'handlebars',
    'backbone.marionette',
    // templates
    'text!templates/views/workspace/actions/action.html'
], function(
    Handlebars,
    Marionette,
    // templates
    actionTemplate
) {

    /**
     * Generic action view
     */
    return Marionette.LayoutView.extend({

        template: Handlebars.default.compile(actionTemplate),

        className: "action",

        /**
         * Register helpers to be used in the template
         * when rendering is called
         * @return {[type]} [description]
         */
        templateHelpers: function () {
            return{
                objects: this.objects,
                triggers: [
                    {value:"onChange", info:"on slide change"},
                    {value:"withPrevious", info:"with previous action"},
                    {value:"afterPrevious", info:"after previous action"}
                ],
                targetId: this.targetId()
            };
        },

        /**
         * Template helper to pre-select the right
         * target in action settings form
         *
         * @return {string} the id without prefix "#"
         */
        targetId: function () {
            if (this.model.get("target") !== null) {
                return this.model.get("target").substring(1);
            }
        },

        /**
         * Set of events fired by the view on user actions.
         * Also call the 'onEvent' function when triggered.
         * @type {Object}
         */
        triggers: {
            "click .actionDelete": "delete",
            "click header": "select",
            "change .targetChoice": "target:change",
            "change .triggerChoice": "trigger:change",
            "change .durationChoice": "duration:change"
        },

        modelEvents: {
            "change:trigger": function () {
                this.render();
                this.ui.settings.show();
            }
        },

        ui: {
            settings: ".settings",
            header: ".headerAction"
        },

        regions: {
            extra: ".extra-settings"
        },

        toggle: false,

        initialize: function(options) {
            // Mandatory arguments
            _.extend(this, _.pick(options, ["screencast", "screenId", "model"]));

            // take the list of objects in a screen to display
            // them in a target choice
            this.objects = this.screencast.model.getScreenById(this.screenId).get("objects").models;
        },

        /**
         * Switch the toggling to hide or display full action view
         * with all parameters
         * @param {boolean} state
         */
        setToggle: function (state) {
            this.toggle = state;
            if (state) {
                this.ui.settings.show();
            } else {
                this.ui.settings.hide();
            }
        },

        /**
         * Remove an action from the action list.
         */
        onDelete: function() {
            // Parent's view will automatically destroy this view when the model is destroyed
            this.model.destroy();
        },

        /**
         * Display full view with all parameters and a set
         * of html input to modify them
         */
        onSelect: function () {
            this.setToggle(!this.toggle);
        },

        /**
         * Update the model according to the user change
         * in the 'target' select.
         */
        onTargetChange: function () {
            // select object by id, so need "#id" to get the right selector
            this.model.set("target", "#" + this.$(".targetChoice").val());
        },

        /**
         * Update the model according to the user change
         * in the 'trigger' select.
         */
        onTriggerChange: function () {
            this.model.set("trigger", this.$(".triggerChoice").val());
        },

        /**
         * Update the model according to the user change
         * in the duration field.
         */
        onDurationChange: function () {
            var value = parseInt(this.$(".durationChoice").val());
            if (!_.isNaN(value)) {
                this.model.set("duration", value);
            } else {
                throw new Exceptions.IOError("Duration input is NaN");
            }
        }

    });
});
