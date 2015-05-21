define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/kernel/SCI',
    'modules/events',
    'modules/utils/modals',
    // layouts
    'layouts/dahuapp',
    'layouts/workspace',
    // views
    'views/workspace/screen',
    'views/workspace/actions',
    'views/filmstrip/screens',
    'views/components/main_toolbar',
    'views/components/workspace_toolbar',
    'views/workspace/note',
    // templates
    'text!templates/modals/tooltip.html'
], function (Handlebars, Marionette, // libraries
             Kernel, events, Modals, // modules
             DahuLayout, WorkspaceLayout, // layouts
             ScreenView, ActionsView, FilmstripScreensView, MainToolbarView, WorkspaceToolbarView, NoteView, // views
             tooltipModalTemplate // templates
) {

    /**
     * Workspace layout controller.
     */
    return Marionette.Controller.extend({
        
        initialize: function(options){
            this.screencast = options.screencast;
        },

        createAndShow: function(region) {
            // create layout
            var layout = this.layout = new DahuLayout();
            layout.render();

            // attach it to holder
            region.show(layout);

            // setup and show toolbar
            layout.toolbar.show(new MainToolbarView({screencast: this.screencast}));

            // setup and show filmstrip
            // if screencast is a new project, it is initialized with no screens.
            layout.filmstrip.show(new FilmstripScreensView({screencast: this.screencast}));

            // setup and show workspace with the first screen if available
            // if not, use an empty screen.
            var workspaceLayout = this.workspaceLayout = new WorkspaceLayout();
            layout.workspace.show(workspaceLayout);

            // setup workspace toolbar
            workspaceLayout.toolbar.show(new WorkspaceToolbarView());

            // register to events
            this._registerToGlobalEvents();
        },

        /**
         * Return global layout.
         * @returns {layout}
         */
        getLayout: function() {
            return this.layout;
        },

        onDestroy: function() {
            this._unregisterFromGlobalEvents();
        },

        /**
         * Register to application events.
         *
         * @private
         */
        _registerToGlobalEvents: function() {
            var self = this;

            // register to events from toolbar
            this.workspaceLayout.toolbar.currentView.on('tooltip:click', function() {
                self._openTooltipModal();
            });

            // register to global events
            // @todo make this a filmstrip event not a global one
            events.on('app:filmstrip:onScreenSelected', function(screenId) {
                if (self.getActiveScreenId() != screenId) {
                    self.showScreenById(screenId);
                }
            });
        },

        /**
         * Register to workspace's screen editor events.
         * @private
         */
        _registerToScreenEditorEvents: function() {
            var self = this;

            this.workspaceLayout.screenEditor.currentView.on('childview:app:workspace:tooltip:edit', function(args) {
                self._openTooltipModal(args.model);
            });
        },

        /**
         * Unregister from application events.
         *
         * @private
         */
        _unregisterFromGlobalEvents: function() {
            // unregister from all
            this.workspaceLayout.toolbar.currentView.off(null, null, this);
            events.off(null, null, this);
        },


        /**
         * Show the first screen of a screencast into the editor.
         */
        showFirstScreen: function() {
            var screen = this.screencast.model.get('screens').first();
            if (screen) {
                this.showScreenById(screen.get('id'));
            }
        },

        /**
         * Show the screen of id `screenId` into the editor.
         *
         * @param screenId Id of the screen to show.
         */
        showScreenById: function(screenId) {
            this.workspaceLayout.screenEditor.show(new ScreenView({
                screencast: this.screencast,
                screenId: screenId
            }));

            this._registerToScreenEditorEvents();

            this.workspaceLayout.actionsEditor.show(new ActionsView({
                screencast: this.screencast,
                screenId: screenId
            }));
            
            this.workspaceLayout.noteEditor.show(new NoteView({
                screencast: this.screencast,
                screenId: screenId
            }));

            // keep id
            this._activeScreenId = screenId;
        },

        /**
         * Open modal for prompting tooltip content.
         * If a `tooltip` model is provided then the content of the tooltip is used as default
         * value for the prompt and the given tooltip will be updated with the prompt.
         * If `tooltip` is undefined then a new tooltip will be created with the content of the prompt.
         *
         * @param tooltip (optional) Tooltip model from which to
         */
         _openTooltipModal: function(tooltip) {
            var template = Handlebars.default.compile(tooltipModalTemplate);
            var content = template({
                title: 'Add a new tooltip',
                command: tooltip ? 'app:screencast:editTooltip' : 'app:screencast:createTooltip',
                screenId: this.getActiveScreenId(),
                tooltipId: tooltip ? tooltip.get('id') : null,
                text: tooltip ? tooltip.get('text') : '',
                width: 582,
                height: 360
            });
            Modals.openPopup(content);
        },


        getActiveScreen: function() {
            return this.screencast.model.getScreenById(this._activeScreenId);
        },

        getActiveScreenId: function() {
            return this._activeScreenId;
        }
    });
});
