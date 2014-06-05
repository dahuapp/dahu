package io.dahuapp.editor.kernel.module;

import io.dahuapp.driver.MediaDriver;
import io.dahuapp.common.kernel.Module;

import java.awt.*;

/**
 * Media kernel module.
 */

public class Media implements Module {

    private MediaDriver.CaptureContext captureContext;

    @Override
    public void load(){
        captureContext = MediaDriver.loadCaptureContext();
    }

    /**
     * Takes a screenShot of the current screen
     * and saves it to projectDir/id.png
     * @param projectDir Path to project directory
     * @param id Unique id of the image
     * @return The name of the image created (or null if fail)
     */
    public String takeScreen(String projectDir, String id) {
        if (MediaDriver.hasChanged(captureContext)){
            captureContext = MediaDriver.loadCaptureContext();
        }
        return MediaDriver.takeScreen(captureContext, projectDir, id);
    }
}
