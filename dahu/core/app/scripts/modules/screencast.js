/**
 * Created by barraq on 7/16/14.
 */

define([
    'handlebars',
    // modules
    'modules/kernel/SCI',
    'modules/utils/paths',
    'modules/utils/exceptions',
    'modules/compiler',
    'modules/helpers/template',
    // models
    'models/screencast'
], function (Handlebars,
    Kernel, Paths, Exceptions, Compiler, TemplateHelper,
    ScreencastModel) {

    var IMAGES_DIRECTORY_NAME = 'img';
    var LIBRARIES_DIRECTORY_NAME = 'libs';
    var BUILD_DIRECTORY_NAME = 'build';
    var SCREENCAST_PREVIEW_FILENAME = 'presentation.html';
    var SCREENCAST_FILENAME = 'presentation.dahu';

    // setup template helper
    TemplateHelper.setup();

    /**
     * Load a screencast.
     *
     * @param projectFilename
     * @return {ScreencastProject}
     * @throws Exceptions.IOError
     */
    function load(projectFilename) {
        if (!Kernel.module('filesystem').exists(projectFilename)) {
            throw new Exceptions.IOError("File #{project} does not exist.", {
                project: projectFilename
            });
        }

        // read project file content
        var projectFileContent = Kernel.module('filesystem').readFromFile(projectFilename);

        // return if content is null
        if( projectFileContent == null ) {
            throw new Exceptions.IOError("Unable to read #{project}.", {
                project: projectFilename
            });
        }

        // check if an upgrade is needed.
        var needAnUpgrade = ScreencastModel.needToUpgradeVersion(projectFileContent);

        // if an update is needed create a backup of old version
        if( needAnUpgrade ) {
            Kernel.module('filesystem').copyFile(projectFilename, projectFilename+'.old')
        }

        // load the screencast
        var screencastModel = ScreencastModel.newFromString(projectFileContent);
        screencastModel.setProjectFilename(projectFilename);

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // save it if it was an upgrade
        if( needAnUpgrade ) {
            screencastModel.save();
        }

        return new ScreencastProject(projectFilename, screencastModel);
    }

    /**
     * Create a new screencast.
     *
     * @param projectFilename
     * @returns {ScreencastProject}
     */
    function create(projectFilename) {
        // create the screencast
        var screencastModel = new ScreencastModel();
        screencastModel.setProjectFilename(projectFilename);

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // save it
        screencastModel.save();

        return new ScreencastProject(projectFilename, screencastModel);
    }

    /**
     * Get screencast filename from `directory`.
     * @param directory Root directory of the screencast project.
     * @returns {string} Path to screencast filename.
     */
    function getScreencastFilenameFromDirectory(directory) {
        return Paths.join([directory, SCREENCAST_FILENAME]);
    }

    /**
     * ScreencastProject holder.
     *
     * @param projectFilename filename of the screencast project.
     * @param screencastModel backbone model of this screencast.
     * @constructor
     */
    var ScreencastProject = function(projectFilename, screencastModel) {
        this.projectFilename = projectFilename;
        this.model = screencastModel;
    };

    _.extend(ScreencastProject.prototype, {

        /**
         * Save a screencast.
         *
         * @param screencastModel The screencast model to save.
         */
        save: function() {
            this.model.save();
        },

        /**
         * Generate the screencast.
         */
        generate: function() {
            // compile the current screencast model
            var generatedHTML = Compiler.compile(this.model);

            // write to disk
            var previewPath = this.getGeneratedScreencastPreviewAbsPath();
            Kernel.console.info("Writing generated screencast to {}", previewPath);
            Kernel.module('filesystem').writeToFile(previewPath, generatedHTML);
            Kernel.console.info("done.");

            // copy media
            Kernel.console.info("Copying images");
            //// copy the image folder to the build/img
            Kernel.module('filesystem').copyDir(
                this.getImagesDirectoryAbsPath(), // origin
                Paths.join([this.getBuildDirectoryAbsPath(), IMAGES_DIRECTORY_NAME]) // destination
            );
            //// copy the cursor
            Kernel.module('filesystem').copyResourceDir(
                'classpath:///io/dahuapp/core/media/images/cursor.png', // origin
                Paths.join([this.getBuildDirectoryAbsPath(), IMAGES_DIRECTORY_NAME]) // destination
            );
            Kernel.console.info("done.");
            // copy resources
            Kernel.console.info("Copying resources");
            //// copy deck.js folder to build/libs/deck.js
            Kernel.module('filesystem').copyResourceDir(
                'classpath:///io/dahuapp/core/components/deck.js', // origin
                Paths.join([this.getBuildDirectoryAbsPath(), LIBRARIES_DIRECTORY_NAME]) // destination
            );
            //// copy fit.js folder to build/libs/fit.js
            Kernel.module('filesystem').copyResourceDir(
                'classpath:///io/dahuapp/core/components/fit.js', // origin
                Paths.join([this.getBuildDirectoryAbsPath(), LIBRARIES_DIRECTORY_NAME]) // destination
            );
            Kernel.console.info("done.");
        },

        /**
         * Clean a screencast
         */
        clean: function() {
            Kernel.module('filesystem').removeDir(this.getBuildDirectoryAbsPath());
        },

        /**
         * Get generated project's screencast preview absolute path.
         *
         *@returns {String} path to generated screencast preview.
         */
        getGeneratedScreencastPreviewAbsPath: function() {
            return Paths.join([this.getBuildDirectoryAbsPath(), SCREENCAST_PREVIEW_FILENAME]);
        },

        /**
         * Get screencast project's directory absolute path.
         *
         * @returns String path to the project directory.
         */
        getProjectDirectoryAbsPath: function() {
            return Paths.dirname(this.projectFilename);
        },

        /**
         * Get screencast project's build directory absolute path.
         *
         * @returns {String} path to the build directory.
         */
        getBuildDirectoryAbsPath: function() {
            return Paths.join([this.getProjectDirectoryAbsPath(), BUILD_DIRECTORY_NAME]);
        },

        /**
         * Get absolute path for `image`.
         *
         * @returns {String} path to the image directory.
         */
        getImageURLFor: function(image) {
            return Paths.join([
                'dahufile:',
                this.getProjectDirectoryAbsPath(),
                IMAGES_DIRECTORY_NAME,
                image.replace(/^images\//, '')      // be sure to remove `images/` if already present.
            ]);
        },

        /**
         * Get screencast project's images directory absolute path.
         *
         * @returns {String} path to the image directory.
         */
        getImagesDirectoryAbsPath: function() {
            return Paths.join([this.getProjectDirectoryAbsPath(), IMAGES_DIRECTORY_NAME]);
        },

        /**
         * Get screencast project's relative images path.
         *
         * @returns {string} path to the image directory.
         */
        getImagesDirectoryRelPath: function() {
            return IMAGES_DIRECTORY_NAME;
        },

        /**
         * Get relative path for `image`.
         *
         * @param image
         * @returns {string}
         */
        getImageRelPathFor: function(image) {
            return Paths.join([IMAGES_DIRECTORY_NAME, image]);
        }
    });

    return {
        load: load,
        create: create,
        getScreencastFilenameFromDirectory: getScreencastFilenameFromDirectory
    }
});
