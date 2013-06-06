package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.KeyboardDriver;
import javafx.scene.web.WebEngine;

/**
 * Proxy for the keyboard driver.
 */
public class KeyboardDriverProxy implements Proxy {

    /**
     * Driver associated with this proxy.
     */
    private KeyboardDriver driver = new KeyboardDriver();
    
    /**
     * WebEngine to perform actions with the javascript.
     */
    private WebEngine webEngine;
    
    /**
     * Constructor.
     * @param webEngine Engine to perform actions with the javascript.
     */
    public KeyboardDriverProxy(WebEngine webEngine) {
        this.webEngine = webEngine;
    }
    
    @Override
    public void onLoad() {
        driver.onLoad();
    }

    @Override
    public void onStop() {
        driver.onStop();
    }
}
