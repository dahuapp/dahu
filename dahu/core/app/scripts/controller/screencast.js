define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/kernel/SCI',
    'modules/events',
    'modules/commands',
    'modules/screencast'
], function (Handlebars, Marionette,
    Kernel, events, commands, Screencast) {

    /**
     * Screencast controller.
     *
     * The screencast controller provides convenient methods to manage screencasts from
     * Backbone.Marionette application and views.
     *
     * The controller relies on the Screencast module which provide core functionalities shared
     * between dahuapp (Editor) and dahubridge (CLI).
     */
    return Marionette.Controller.extend({

        /**
         * Load a screencast.
         *
         * @param projectFilename
         */
        load: function(projectFilename) {
            if( this.screencast ) {
                throw "A Dahu project ("+this.screencast.projectFilename+") is already loaded."
            }

            try {
                this.screencast = Screencast.load(projectFilename);
                this._registerToGlobalEvents();
                this._registerToCommands();
                Kernel.module('contextmanager').setDisableScreencastMenus(false);
            } catch(e) {
                Kernel.module('contextmanager').setDisableScreencastMenus(true);
                Kernel.console.error(e);
                this.screencast = null;
            }
        },

        /**
         * Create a screencast.
         *
         * @param projectFilename
         */
        create: function (projectFilename) {
            if( this.screencast ) {
                throw "A Dahu project ("+this.screencast.projectFilename+") is already loaded."
            }

            try {
                this.screencast = Screencast.create(projectFilename);
                this._registerToGlobalEvents();
                this._registerToCommands();
                Kernel.module('contextmanager').setDisableScreencastMenus(false);
            } catch(e) {
                Kernel.console.error(e);
                Kernel.module('contextmanager').setDisableScreencastMenus(true);
                this.screencast = null;
            }
        },

        onDestroy: function() {
            this._unregisterFromGlobalEvents();
        },

        /**
         * Register to application events
         * @private
         */
        _registerToGlobalEvents: function() {

        },

        /**
         * Register to application commands
         * @private
         */
        _registerToCommands: function() {
            var self = this;

            commands.setHandler('app:screencast:createTooltip', function(screenId, tooltipId, text) {
                self.addTooltipToScreen(screenId, text);
            });

            commands.setHandler('app:screencast:editTooltip', function(screenId, tooltipId, text) {
                self.updateTooltip(screenId, tooltipId, text);
            });
        },

        /**
         * Unregister from application events
         * @private
         */
        _unregisterFromGlobalEvents: function() {

        },

        /**
         * Save the current screencast project.
         *
         * @see Screencast.save
         */
        save: function() {
            if( this.screencast ) {
                events.trigger("before:app:screencast:save");
                events.trigger("app:screencast:save");
                this.screencast.save();
            } else {
                throw "No Dahu project loaded."
            }
        },

        /**
         * Clean the current screencast project.
         *
         * @see Screencast.clean
         */
        clean: function() {
            if( this.screencast ) {
                this.screencast.clean();
            } else {
                throw "No Dahu project loaded."
            }
        },

        /**
         * Generate a screencast.
         *
         * @see Screencast.generate
         */
        generate: function() {
            if( this.screencast ) {
                this.screencast.generate();
            } else {
                throw "No Dahu project loaded."
            }
        },

        /**
         * Add a tooltip to screen of id `screenId` with the given `text`.
         *
         * @param screenId
         * @param text
         */
        addTooltipToScreen: function(screenId, text) {
            var screen = this.screencast.model.getScreenById(screenId);
            if (screen) {
                screen.createAndAddTooltipFromText(text);
            }
        },

        /**
         * Update `text` of the tooltip of id `tooltipId` on the screen of id `screenId`.
         *
         * @param screenId
         * @param tooltipId
         * @param text
         */
        updateTooltip: function(screenId, tooltipId, text) {
            var screen = this.screencast.model.getScreenById(screenId);
            if (screen) {
                screen.updateTooltip(tooltipId, {text: text});
            }
        }
    });
});
