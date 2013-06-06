package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.*;
import javafx.scene.web.WebEngine;

/**
 * Manager of all the drivers.
 * Offers an interface between the javascript and the java
 * with access to some methods of the drivers.
 */
public class DahuAppDriverProxy implements Proxy {
    
    public DummyDriver dummy;
    public KeyboardDriver keyboard;
    public FileSystemDriver fileSystem;
    public ScreenDriver screen;
    
    /**
     * Constructor.
     * @param webEngine The webEngine associated with the webView.
     */
    public DahuAppDriverProxy(WebEngine webEngine) {
        // init all drivers
        dummy = new DummyDriver(webEngine);
        keyboard = new KeyboardDriver(webEngine);
        fileSystem = new FileSystemDriver();
        screen = new ScreenDriver();
        
        // load all drivers
        dummy.onLoad();
        keyboard.onLoad();
        fileSystem.onLoad();
        screen.onLoad();
    }
    
    @Override
    public void onLoad() {
        // ignore
    }
    
    @Override
    public void onStop() {
        // ignore
    }
}
