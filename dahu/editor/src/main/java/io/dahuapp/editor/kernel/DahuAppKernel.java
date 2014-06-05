package io.dahuapp.editor.kernel;

import io.dahuapp.common.javascript.WebEngineRuntime;
import io.dahuapp.common.kernel.Kernel;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.editor.kernel.module.FileSystem;
import io.dahuapp.editor.kernel.module.Keyboard;
import io.dahuapp.editor.kernel.module.Logger;
import javafx.application.Platform;
import javafx.stage.Stage;


/**
 * Kernel implementation for DahuApp.
 */
public class DahuAppKernel implements Kernel {

    // kernel modules
    public Logger console;
    public FileSystem filesystem;
    public Keyboard keyboard;

    // shared objects
    private Stage primaryStage;
    private WebEngineRuntime webEngineRuntime;

    public DahuAppKernel(Stage stage, WebEngineRuntime webEngineRuntime, DahuFileAccessManager fileAccessManager) {
        this.primaryStage = stage;
        this.webEngineRuntime = webEngineRuntime;

        console = new Logger();
        filesystem = new FileSystem(primaryStage, fileAccessManager);
        keyboard = new Keyboard(webEngineRuntime);
    }

    @Override
    public void start() {
        console.load();
        filesystem.load();
        keyboard.load();
        // done loading
        console.info("Dahuapp kernel started!");
    }

    @Override
    public void stop() {
        console.info("Dahuapp kernel stopped!");
        // unload
        filesystem.unload();
        keyboard.unload();
        console.unload();
        // exit app
        Platform.exit();
    }
}
