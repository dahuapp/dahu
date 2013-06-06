package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.ScreenDriver;
import javafx.scene.web.WebEngine;

/**
 * Proxy for the screen driver.
 */
public class ScreenDriverProxy implements Proxy {
    
    /**
     * Driver associated with this proxy.
     */
    private ScreenDriver driver = new ScreenDriver();
    
    @Override
    public void onLoad() {
        driver.onLoad();
    }

    @Override
    public void onStop() {
        driver.onStop();
    }
}
