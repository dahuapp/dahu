package io.dahuapp.editor.proxy;

import javafx.scene.web.WebEngine;

/**
 * Manager of all the drivers.
 * Offers an interface between the javascript and the java
 * with access to some methods of the drivers.
 */
public class DahuAppDriverProxy implements Proxy {
    
    /**
     * Proxy for the different drivers.
     */
    public KeyboardDriverProxy keyboard;
    public FileSystemDriverProxy fileSystem;
    public ScreenDriverProxy screen;
    
    /**
     * Constructor.
     * @param webEngine The webEngine associated with the webView.
     */
    public DahuAppDriverProxy(WebEngine webEngine) {
        // init all proxies
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy();
        screen = new ScreenDriverProxy();
    }
    
    @Override
    public void onLoad() {
        keyboard.onLoad();
        fileSystem.onLoad();
        screen.onLoad();
    }
    
    @Override
    public void onStop() {
        keyboard.onStop();
        fileSystem.onStop();
        screen.onStop();
    }
}
