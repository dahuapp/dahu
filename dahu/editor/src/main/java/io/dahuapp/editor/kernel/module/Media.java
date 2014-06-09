package io.dahuapp.editor.kernel.module;

import io.dahuapp.driver.MediaDriver;
import io.dahuapp.driver.MediaDriver.Capture;
import io.dahuapp.common.kernel.Module;


/**
 * Media kernel module.
 */
public class Media implements Module {

    private MediaDriver.CaptureContext captureContext;

    @Override
    public void load(){
        captureContext = MediaDriver.loadCaptureContext();
    }

    public Capture takeCapture(String projectDir, String imageId) {
        if (MediaDriver.hasChanged(captureContext)){
            captureContext = MediaDriver.loadCaptureContext();
        }

        return MediaDriver.takeCapture(captureContext, projectDir, imageId);
    }
}
