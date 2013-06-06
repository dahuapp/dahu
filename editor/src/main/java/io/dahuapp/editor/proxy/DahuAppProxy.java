package io.dahuapp.editor.proxy;

import javafx.scene.web.WebEngine;

/**
 * Manager of all the drivers. Offers an interface between the javascript and
 * the java with access to some methods of the drivers.
 */
public class DahuAppProxy implements Proxy {

    /**
     * Proxy for the different drivers.
     */
    public MouseDriverProxy mouse;
    public KeyboardDriverProxy keyboard;
    public FileSystemDriverProxy fileSystem;
    public ScreenDriverProxy screen;
    /**
     * Other Proxy.
     */
    public LoggerProxy logger;

    /**
     * Constructor.
     *
     * @param webEngine The webEngine associated with the webView.
     */
    public DahuAppProxy(WebEngine webEngine) {
        // init all proxies
        logger = new LoggerProxy();
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy();
        screen = new ScreenDriverProxy();
        mouse = new MouseDriverProxy();
    }

    /**
     * Constructor.
     *
     * @param webEngine The webEngine associated with the webView
     * @param loggerDirectory path of the file to log
     */
    public DahuAppProxy(WebEngine webEngine, String loggerDirectory) {
        // init all proxies
        logger = new LoggerProxy(loggerDirectory);
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy();
        screen = new ScreenDriverProxy();
        mouse = new MouseDriverProxy();
    }

    @Override
    public void onLoad() {
        // more logical in logs than 'log.load' appears in the beginning
        logger.onLoad();
        keyboard.onLoad();
        fileSystem.onLoad();
        screen.onLoad();
        mouse.onLoad();
    }

    @Override
    public void onStop() {
        keyboard.onStop();
        fileSystem.onStop();
        screen.onStop();
        logger.onStop();
        mouse.onStop();
    }
}
