package io.dahuapp.editor.proxy;

import javafx.scene.web.WebEngine;

/**
 * Manager of all the drivers.
 * Offers an interface between the javascript and the java
 * with access to some methods of the drivers.
 */
public class DahuAppProxy implements Proxy {
    
    /**
     * Proxy for the different drivers.
     */
    public KeyboardDriverProxy keyboard;
    public FileSystemDriverProxy fileSystem;
    public ScreenDriverProxy screen;
    /**
     * Other Proxy.
     */
    public LoggerProxy logger;
    
    
    /**
     * Constructor.
     * @param webEngine The webEngine associated with the webView.
     */
    public DahuAppProxy(WebEngine webEngine) {
        // init all proxies
        logger = new LoggerProxy();
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy();
        screen = new ScreenDriverProxy();
    }
    
    /**
     * Constructor.
     * @param webEngine The webEngine associated with the webView
     * @param loggerDirectory path of the file to log
     */
    public DahuAppProxy(WebEngine webEngine, String loggerDirectory) {
        // init all proxies
        logger = new LoggerProxy(loggerDirectory);
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy();
        screen = new ScreenDriverProxy();
    }
    
    @Override
    public void onLoad() {
        keyboard.onLoad();
        fileSystem.onLoad();
        screen.onLoad();
        logger.onLoad();
    }
    
    @Override
    public void onStop() {
        keyboard.onStop();
        fileSystem.onStop();
        screen.onStop();
        logger.onStop();
    }
}
