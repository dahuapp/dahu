package io.dahuapp.editor;


import io.dahuapp.common.javascript.WebEngineRuntime;
import io.dahuapp.common.net.DahuFileAccessManager;
import io.dahuapp.common.net.DahuURLStreamHandlerFactory;
import io.dahuapp.common.net.RegexURLRewriter;
import io.dahuapp.editor.helper.OSCheck;
import io.dahuapp.editor.kernel.DahuAppKernel;
import io.dahuapp.editor.ui.Modal;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.StackPane;
import javafx.scene.text.FontSmoothingType;
import javafx.scene.web.PopupFeatures;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import javafx.util.Callback;
import netscape.javascript.JSObject;

import java.net.URL;

/**
 * Main class of the application. Runs the GUI to allow the user to take
 * screenshots and edit the presentation he wants to make.
 */
public class DahuAppImpl extends Application implements DahuApp {

    /**
     * Title of the application.
     */
    public static final String TITLE = "DahuApp Editor";
    /**
     * Minimum width of the editor window.
     */
    private static final int MIN_WIDTH = 720;
    /**
     * Minimum height of the editor window.
     */
    private static final int MIN_HEIGHT = 520;

    /**
     * Application components
     */
    private Stage primaryStage;
    private WebView webView;
    private WebEngineRuntime webEngineRuntime;
    private DahuFileAccessManager dahuFileAccessManager;
    private RegexURLRewriter dahuRegexURLRewriter;

    // Menu
    private MenuBar menuBar;
    private Menu menuCapture;
    private Menu menuGeneration;

    /**
     * The main() method is ignored in correctly deployed JavaFX application.
     * main() serves only as fallback in case the application can not be
     * launched through deployment artifacts, e.g., in IDEs with limited FX
     * support. NetBeans ignores main().
     *
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        /* fix for osx */
        System.setProperty("javafx.macosx.embedded", "true");
        java.awt.Toolkit.getDefaultToolkit();

        /* launch app */
        launch(args);
    }

    /**
     * Gets the path of a ressource of the application.
     *
     * @param name Name of the resource to find.
     * @return The path to the resource (as it can be put in a file and opened).
     */
    public static String getResource(String name) {
        return DahuAppImpl.class.getResource(name).toExternalForm();
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        // init dahu application
        initDahuApp(primaryStage);

        // init dahu menu
        initDahuMenu();

        // init layout
        initDahuLayout(primaryStage);

        // ready
        primaryStage.setTitle(TITLE);
        //primaryStage.setFullScreen(true);
        primaryStage.show();
    }

    /**
     * Initializes the WebView with the HTML content and binds the drivers to
     * the Dahuapp JavaScript object.
     *
     * @param primaryStage Main stage of the app (for the kernel).
     */
    private void initDahuApp(final Stage primaryStage) {
        webView = new WebView();
        webView.setContextMenuEnabled(false);
        webView.setFontSmoothingType(FontSmoothingType.LCD);

        // init JavascriptRuntime
        webEngineRuntime = new WebEngineRuntime(webView.getEngine());

        // init dahu file acess manager
        dahuFileAccessManager = new DahuFileAccessManager();

        // init dahu URL rewriter
        dahuRegexURLRewriter = new RegexURLRewriter();

        // set custom URL stream factory
        URL.setURLStreamHandlerFactory(new DahuURLStreamHandlerFactory(
                getClass().getClassLoader(),
                dahuFileAccessManager,
                dahuRegexURLRewriter));

        webView.getEngine().load("classpath:///io/dahuapp/core/app.html");

        // extend the webView js context
        webView.getEngine().getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>() {
            @Override
            public void changed(final ObservableValue<? extends Worker.State> observableValue, final Worker.State oldState, final Worker.State newState) {
                if (newState == Worker.State.SUCCEEDED) {

                    // load FirebugLite for debugging
                    webEngineRuntime.loadFirebugLite(
                            true,   // local version - yes
                            false   // start opened  - no
                    );

                    // load kernel
                    JSObject window = webEngineRuntime.get("window");
                    window.setMember("kernel", new DahuAppKernel(
                            DahuAppImpl.this,
                            webEngineRuntime,
                            dahuFileAccessManager,
                            dahuRegexURLRewriter));

                    // start application
                    webEngineRuntime.executeScriptCommand("dahuapp.start();");
                }
            }
        });

        webView.getEngine().setCreatePopupHandler(
                new Callback<PopupFeatures, WebEngine>() {
                    @Override
                    public WebEngine call(PopupFeatures config) {
                        final Modal dialog = new Modal(primaryStage);
                        return dialog.getWebEngine();
                    }
                }
        );
    }

    /**
     * Initialize Dahu main menu.
     * <p/>
     * We use native menu bar so that it can be better
     * handled by the OS (e.g. moved at the top in iOS)
     */
    private void initDahuMenu() {
        // File
        Menu menuFile = new Menu("File");

        // File > New
        MenuItem menuFileCreate = new MenuItem("New");
        menuFileCreate.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:createScreencast');");
        });

        // File > Open
        MenuItem menuFileOpen = new MenuItem("Open");
        menuFileOpen.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:loadScreencast');");
        });

        // File > Save
        MenuItem menuProjectSave = new MenuItem("Save");
        menuProjectSave.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:saveScreencast');");
        });

        // Exit @todo only put this button when there is not windows border: e.g in Awesome Window Manager.
        // otherwise user can exit the application using the usual [x] button
        MenuItem menuProjectExit = new MenuItem("Exit");
        menuProjectExit.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.stop();");
        });

        menuFile.getItems().addAll(menuFileCreate, menuFileOpen, new SeparatorMenuItem(), menuProjectSave, new SeparatorMenuItem(), menuProjectExit);

        // Capture
        menuCapture = new Menu("Capture");
        menuCapture.setDisable(true);

        // Capture > Start
        MenuItem menuCaptureStart = new MenuItem("Start");
        menuCaptureStart.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:startCapture');");
        });

        // Capture > Stop
        MenuItem menuCaptureStop = new MenuItem("Stop");
        menuCaptureStop.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:stopCapture');");
        });

        menuCapture.getItems().addAll(menuCaptureStart,new SeparatorMenuItem(),menuCaptureStop);

        // Generation
        menuGeneration = new Menu("Generation");
        menuGeneration.setDisable(true);

        // Generation > Clean
        MenuItem menuGenerationClean = new MenuItem("Clean");
        menuGenerationClean.setOnAction((event) ->{
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:cleanScreencast');");
        });

        // Generation > Generate
        MenuItem menuGenerationGenerate = new MenuItem("Clean and generate");
        menuGenerationGenerate.setOnAction((event) ->{
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:generateScreencast');");
        });

        // Generation > Preview
        MenuItem menuGenerationPreview = new MenuItem("Preview");
        menuGenerationPreview.setOnAction((event) ->{
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:previewScreencast');");
        });

        menuGeneration.getItems().addAll(menuGenerationClean, menuGenerationGenerate, menuGenerationPreview);

        // Help
        Menu menuHelp = new Menu("Help");

        // Help > Tip of the Day
        MenuItem menuHelpTips = new MenuItem("Tip of the Day");
        menuHelpTips.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:openTipsOfTheDay');");
        });

        // Help > Submit Feedback
        MenuItem menuHelpFeedback = new MenuItem("Submit Feedback");
        menuHelpFeedback.setOnAction((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.commands.execute('app:submitFeedback');");
        });

        menuHelp.getItems().addAll(menuHelpTips, new SeparatorMenuItem(), menuHelpFeedback);

        // Create the main menu bar
        menuBar = new MenuBar();
        menuBar.getMenus().addAll(menuFile, menuCapture, menuGeneration, menuHelp);
    }

    private void initDahuLayout(Stage primaryStage) {
        StackPane rootPane = new StackPane();
        BorderPane borderPane = new BorderPane();

        OSCheck.OSType OS = OSCheck.getOperatingSystemType();

        // pin the menu
        borderPane.setTop(menuBar);
        if (OS == OSCheck.OSType.MacOS) {
            menuBar.setUseSystemMenuBar(true);
        }

        // pin the webView
        borderPane.setCenter(webView);

        // done
        rootPane.getChildren().add(borderPane);

        // create the scene
        Scene scene = new Scene(rootPane, MIN_WIDTH, MIN_HEIGHT);
        primaryStage.setScene(scene);

        primaryStage.setMinWidth(MIN_WIDTH);
        primaryStage.setMinHeight(MIN_HEIGHT);
        primaryStage.setOnCloseRequest((event) -> {
            webEngineRuntime.executeScriptCommand("dahuapp.stop();");
        });
    }

    @Override
    public Stage getPrimaryStage() {
        return primaryStage;
    }

    @Override
    public void setDisableScreencastMenus(boolean value) {
        menuCapture.setDisable(value);
        menuGeneration.setDisable(value);
    }
}
