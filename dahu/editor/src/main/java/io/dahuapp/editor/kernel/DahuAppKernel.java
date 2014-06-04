package io.dahuapp.editor.kernel;

import io.dahuapp.common.javascript.WebEngineRuntime;
import io.dahuapp.common.kernel.Kernel;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.editor.kernel.module.FileSystem;
import io.dahuapp.editor.kernel.module.Logger;
import io.dahuapp.editor.kernel.module.Media;
import javafx.application.Platform;
import javafx.stage.Stage;


/**
 * Kernel implementation for DahuApp.
 */
public class DahuAppKernel implements Kernel {

    // kernel modules
    public Logger console;
    public FileSystem filesystem;
    public Media media;

    // shared objects
    private Stage primaryStage;
    private WebEngineRuntime webEngineRuntime;

    public DahuAppKernel(Stage stage, WebEngineRuntime webEngineRuntime, DahuFileAccessManager fileAccessManager) {
        this.primaryStage = stage;
        this.webEngineRuntime = webEngineRuntime;

        console = new Logger();
        filesystem = new FileSystem(primaryStage, fileAccessManager);
        media = new Media();
    }

    @Override
    public void start() {
        console.load();
        filesystem.load();
        media.load();
        // done loading
        console.info("Dahuapp kernel started!");
    }

    @Override
    public void stop() {
        console.info("Dahuapp kernel stopped!");
        // unload
        filesystem.unload();
        console.unload();
        media.unload();
        // exit app
        Platform.exit();
    }
}
