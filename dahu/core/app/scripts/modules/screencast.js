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
    // models
    'models/screencast'
], function (Handlebars,
    Kernel, Paths, Exceptions, Compiler,
    ScreencastModel) {

    /**
     * Handlebars *global* setup.
     *
     * Here we define global helpers.
     * Global helpers must not depend on any modules.
     */
    Handlebars.default.registerHelper('normalizedToPixel', function (prop, taille) {
        return prop * taille;
    });

    /**
     * Load a screencast from a file and return a model of the screencast.
     *
     * @param projectFilename
     * @return {ScreencastModel}
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

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // save it if it was an upgrade
        if( needAnUpgrade ) {
            save(screencastModel);
        }

        return screencastModel;
    }

    /**
     * Create a new screencast.
     *
     * @param projectFilename
     * @returns {ScreencastModel}
     */
    function create(projectFilename) {
        // create the screencast
        var screencastModel = new ScreencastModel();

        // grant access to project
        Kernel.module('filesystem').grantAccessToDahuProject(projectFilename);

        // save it
        screencastModel.save();

        return screencastModel;
    }

    function generate(screencastModel, projectFilename) {
        var BUILD_DIR = getBuildDirectory(projectFilename);
        var IMAGE_DIR = getImageDirectory(projectFilename);

        // compile the current screencast model
        var generatedHTML = Compiler.compile(screencastModel);

        // write to disk
        var path = Paths.join([BUILD_DIR, 'presentation.html']);
        Kernel.console.info("Writing generated screencast to {}", path);
        Kernel.module('filesystem').writeToFile(path, generatedHTML);
        Kernel.console.info("done.");

        // copy media
        Kernel.console.info("Copying images");
        //// copy the image folder to the build/img
        Kernel.module('filesystem').copyDir(
            IMAGE_DIR, // origin
            Paths.join([BUILD_DIR, 'img']) // destination
        );
        //// copy the cursor
        Kernel.module('filesystem').copyResourceDir(
            'classpath:///io/dahuapp/core/media/images/cursor.png', // origin
            Paths.join([BUILD_DIR, 'img']) // destination
        );
        Kernel.console.info("done.");
        // copy resources
        Kernel.console.info("Copying resources");
        //// copy deck.js folder to build/libs/deck.js
        Kernel.module('filesystem').copyResourceDir(
            'classpath:///io/dahuapp/core/components/deck.js', // origin
            Paths.join([BUILD_DIR, 'libs']) // destination
        );
        Kernel.console.info("done.");
    }

    /**
     * Save a screencast.
     *
     * @param screencastModel The screencast model to save.
     */
    function save(screencastModel) {
        screencastModel.save();
    }

    /**
     * Get screencast project's directory from project filename.
     *
     * @param projectFilename
     * @returns String path to the project directory.
     */
    function getProjectDirectory(projectFilename){
        return Paths.dirname(projectFilename);
    }

    /**
     * Get screencast project's build directory from project filename.
     *
     * @param projectFilename
     * @returns {String} path to the build directory.
     */
    function getBuildDirectory(projectFilename) {
        return Paths.join([getProjectDirectory(projectFilename), 'build']);
    }

    /**
     * Get screencast project's image directory from a project filename.
     *
     * @param projectFilename
     * @returns {String} path to the image directory.
     */
    function getImageDirectory(projectFilename) {
        return Paths.join([getProjectDirectory(projectFilename), 'img']);
    }

    return {
        load: load,
        create: create,
        generate: generate,
        save: save,
        getProjectDirectory: getProjectDirectory,
        getBuildDirectory: getBuildDirectory,
        getImageDirectory: getImageDirectory
    }
});