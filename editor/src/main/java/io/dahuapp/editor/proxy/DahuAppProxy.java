package io.dahuapp.editor.proxy;

import io.dahuapp.editor.app.DahuApp;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import javafx.stage.Stage;

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
     * Other Proxies.
     */
    public LoggerProxy logger;
    public RootDirectoryProxy rootDirectory;
    public PreviewProxy preview;
    
    /**
     * Engine.
     */
    private WebEngine webEngine;
    
    /**
     * Primary stage.
     */
    private Stage primaryStage;
    
    /**
     * Constructor.
     * @param primaryStage The main stage (for modal dialogs).
     * @param webEngine The webEngine associated with the webView.
     */
    public DahuAppProxy(Stage primaryStage, WebEngine webEngine) {
        // init all proxies
        logger = new LoggerProxy();
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy(primaryStage);
        screen = new ScreenDriverProxy();
        mouse = new MouseDriverProxy();
        rootDirectory = new RootDirectoryProxy();
        preview = new PreviewProxy();
        // attributes
        this.webEngine = webEngine;
        this.primaryStage = primaryStage;
    }

    /**
     * Constructor.
     * @param primaryStage The main stage (for modal dialogs).
     * @param webEngine The webEngine associated with the webView
     * @param loggerDirectory path of the file to log
     */
    public DahuAppProxy(Stage primaryStage, WebEngine webEngine, String loggerDirectory) {
        // init all proxies
        logger = new LoggerProxy(loggerDirectory);
        keyboard = new KeyboardDriverProxy(webEngine);
        fileSystem = new FileSystemDriverProxy(primaryStage);
        screen = new ScreenDriverProxy();
        mouse = new MouseDriverProxy();
        rootDirectory = new RootDirectoryProxy();
        preview = new PreviewProxy();
        // attributes
        this.webEngine = webEngine;
        this.primaryStage = primaryStage;
    }
    
    /**
     * Exits the application.
     */
    public void exit() {
        webEngine.executeScript("dahuapp.drivers.onStop();");
        Platform.exit();
    }
    
    /**
     * Changes the titlebar of the application.
     * @param project Name of the project.
     */
    public void setTitleProject(String project) {
        primaryStage.setTitle(DahuApp.TITLE + " - " + project);
    }

    @Override
    public void onLoad() {
        // more logical in logs than 'logger.load' appears in the beginning
        logger.onLoad();
        keyboard.onLoad();
        fileSystem.onLoad();
        screen.onLoad();
        mouse.onLoad();
        preview.onLoad();
    }

    @Override
    public void onStop() {
        keyboard.onStop();
        fileSystem.onStop();
        screen.onStop();
        mouse.onStop();
        preview.onStop();
        // idem for 'logger.stop'
        logger.onStop();
    }
}
