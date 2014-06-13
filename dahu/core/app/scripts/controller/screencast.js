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
    'modules/requestResponse',
    // models
    'models/screencast'
], function (Handlebars, Marionette,
    Kernel, Paths, Compiler, ReqResponse,
    ScreencastModel) {


    /**
     * Screencast controller
     */
    var ScreencastController = Marionette.Controller.extend({
        /*
         * Create a general helpers
         */
        loadTemplate: function() {
            Handlebars.default.registerHelper('normalizedToPixel', function (prop, taille) {
                return prop * taille;
            });
        },
        updateSettings: function() {
            var width = this.getScreencastModel().get('settings').screenWidth;
            Handlebars.default.registerHelper('screencastWidth', function () {
                return width;
            });
            var height = this.getScreencastModel().get('settings').screenHeight;
            Handlebars.default.registerHelper('screencastHeight', function () {
                return height;
            });
        },


    /**
         * Load a screencast project.
         *
         * @param projectFilename
         */
        load: function(projectFilename) {
            if( this.loaded ) {
                throw "A Dahu project ("+this.projectFilename+") is already loaded."
            }

            // keep track of screencast project filename
            this.projectFilename = projectFilename;

            // read project file content
            var projectFileContent = Kernel.module('filesystem').readFromFile(projectFilename);

            // return if content is null
            if( projectFileContent == null ) {
                return;
            }

            // check if an upgrade is needed.
            var needAnUpgrade = ScreencastModel.needToUpgradeVersion(projectFileContent);

            // if an update is needed create a backup of old version
            if( needAnUpgrade ) {
                Kernel.module('filesystem').copyFile(projectFilename, projectFilename+'.old')
            }

            // load the screencast
            this.screencastModel = ScreencastModel.newFromString(projectFileContent);

            // grant access to project
            Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

            // we are loaded
            this.loaded = true;

            // save it if it was an upgrade
            if( needAnUpgrade ) {
                this.save();
            }
        },

        create: function (projectFilename) {
            if( this.loaded ) {
                throw "A Dahu project ("+this.projectFilename+") is already loaded."
            }

            // keep track of screencast project filename
            this.projectFilename = projectFilename;

            // create the screencast
            this.screencastModel = new ScreencastModel();

            // grant access to project
            Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

            // we are loaded
            this.loaded = true;

            // save it
            this.save();
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
        },

        /**
         * Save the current screencast project.
         */
        save: function() {
            if( this.loaded && this.screencastModel ) {
                this.screencastModel.save();
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
                Kernel.module('filesystem').removeDir(Paths.join([getProjectDirectory(), 'build']));
            } else {
                throw "No Dahu project loaded."
            }
        },

        generate: function() {
            if( this.loaded ) {
                // compile the current screencast model
                var generatedHTML = Compiler.compile(this.screencastModel);

                // write to disk
                var path = Paths.join([this.getProjectBuildDirectory(), 'presentation.html']);
                Kernel.console.info("Writing generated screencast to {}", path);
                Kernel.module('filesystem').writeToFile(path, generatedHTML);
                Kernel.console.info("done.");

                Kernel.console.info("Copying images");
                // copy the image folder to the build/img
                Kernel.module('filesystem').copyDir(
                    this.getProjectImgDirectory, // origin
                    Paths.join([this.getProjectBuildDirectory(), 'img']) // destination
                );
                Kernel.console.info("done.");
            } else {
                throw "No Dahu project loaded."
            }
        },

        getScreencastModel: function() {
            return this.screencastModel;
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
                this.projectDirectory = Paths.dirname(this.projectFilename);
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
                this.projectBuildDirectory = Paths.join([this.getProjectDirectory(), 'build']);
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
            return Paths.join([this.getProjectDirectory(), 'img']);
        },

        /**
         * Gets the relative path of the img file of the current project
         * i.e : 'img/nameOfImg.extension'
         */
        getRelativeImgPath: function (img) {
            return Paths.join(['img', img]);
        }
    });

    return ScreencastController;

});