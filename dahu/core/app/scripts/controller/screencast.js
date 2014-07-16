/**
 * Created by mouad on 06/06/14.
 */

define([
    'handlebars',
    'backbone.marionette',
    // modules
    'modules/kernel/SCI',
    'modules/utils/paths',
    'modules/compiler',
    'modules/screencast'
], function (Handlebars, Marionette,
    Kernel, Paths, Compiler, Screencast) {

    /**
     * Screencast controller.
     *
     * The screencast controller provides convenient methods to manage screencasts from
     * Backbone.Marionette application and views.
     *
     * The controller relies on the Screencast module which provide core functionalities shared
     * between dahuapp (Editpr) and dahubridge (CLI).
     */
    return Marionette.Controller.extend({

        /**
         * Load a screencast.
         *
         * @param projectFilename
         */
        load: function(projectFilename) {
            if( this.loaded ) {
                throw "A Dahu project ("+this.projectFilename+") is already loaded."
            }

            // keep track of screencast project filename
            this.projectFilename = projectFilename;

            try {
                this.screencastModel = Screencast.load(projectFilename);
                this.loaded = true;
            } catch(e) {
                Kernel.console.error(e);
            }
        },

        /**
         * Create a screencast.
         *
         * @param projectFilename
         */
        create: function (projectFilename) {
            if( this.loaded ) {
                throw "A Dahu project ("+this.projectFilename+") is already loaded."
            }

            // keep track of screencast project filename
            this.projectFilename = projectFilename;

            try {
                this.screencastModel = Screencast.create(projectFilename);
                this.loaded = true;
            } catch(e) {
                Kernel.console.error(e);
            }
        },

        /**
         * Close the current screencast project.
         */
        close: function() {
            this.loaded = false;
            this.screencastModel = null;
            this.projectFilename = null;
            this.projectDirectory = null;
            this.projectBuildDirectory = null;
            this.projectImageDirectory = null;
        },

        /**
         * Save the current screencast project.
         */
        save: function() {
            if( this.loaded && this.screencastModel ) {
                Screencast.save(this.screencastModel);
            } else {
                throw "No Dahu project loaded."
            }
        },

        /**
         * Clean the current screencast project.
         *
         * @param projectDirectory Path to the project directory
         */
        clean: function() {
            if( this.loaded ) {
                Kernel.module('filesystem').removeDir(this.getProjectBuildDirectory());
            } else {
                throw "No Dahu project loaded."
            }
        },

        /**
         * Generate a screencast.
         *
         * @see ScreencastModel.generate
         */
        generate: function() {
            if( this.loaded ) {
                Screencast.generate(this.screencastModel, this.projectFilename);
            } else {
                throw "No Dahu project loaded."
            }
        },

        getScreencastModel: function() {
            return this.screencastModel;
        },

        /**
         * Return the current screencast width.
         */
        getScreencastWidth: function() {
            return this.screencastModel.get('settings').get('screenWidth');
        },

        /**
         * Return the current screencast height.
         */
        getScreencastHeight: function() {
            return this.screencastModel.get('settings').get('screenHeight');
        },

        /**
         * Gets the current screencast project's filename.
         * @returns {*}
         */
        getProjectFilename: function() {
            return this.projectFilename;
        },

        /**
         * Gets the current screencast project's directory.
         *
         * @returns String
         */
        getProjectDirectory: function(){
            if( ! this.projectDirectory) {
                this.projectDirectory = Screencast.getProjectDirectory(this.projectFilename);
            }

            return this.projectDirectory;
        },

        /**
         * Get the current screencast project's *build* directory.
         *
         * @returns {String} path to the build directory.
         */
        getProjectBuildDirectory: function() {
            if( ! this.projectBuildDirectory ) {
                this.projectBuildDirectory = Screencast.getProjectBuildDirectory(this.projectFilename);
            }

            return this.projectBuildDirectory;
        },

        /**
         * Gets the full path of a project picture
         */
        getImgFullPath: function(img) {
            return Paths.join(['dahufile:', this.getProjectDirectory(), img]);
        },

        /**
         * Gets path of a Dahu screencast project file according  to some *directory*.
         *
         * @param directory of the project
         * @return {String} dahu screencast filename.
         */
        getDahuFileFromDirectory: function (directory) {
            return Paths.join([directory, 'presentation.dahu']);
        },

        /**
         * Gets path of a generated Dahu screencast according to some *directory*.
         *
         * @param directory of the project
         * @return {String} dahu screencast filename.
         */
        getDahuFileGeneratedScreencastFromDirectory: function (directory) {
            return Paths.join([directory, 'presentation.html']);
        },

        /**
         * Gets the full path of the img directory of the current project
         */
        getProjectImgDirectory: function () {
            if( ! this.projectImageDirectory ) {
                this.projectImageDirectory = Screencast.getImageDirectory(this.projectFilename);
            }

            return this.projectImageDirectory
        },

        /**
         * Gets the relative path of the img file of the current project
         * i.e : 'img/nameOfImg.extension'
         */
        getRelativeImgPath: function (img) {
            return Paths.join(['img', img]);
        }
    });
});
