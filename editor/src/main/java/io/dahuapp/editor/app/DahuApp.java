package io.dahuapp.editor.app;

import io.dahuapp.editor.proxy.DahuAppProxy;
import javafx.application.Application;
import static javafx.application.Application.launch;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.concurrent.Worker.State;

/**
 * Main class of the application.
 * Runs the GUI to allow the user to take screenshots and
 * edit the presentation he wants to make.
 */
public class DahuApp extends Application {
    
    /**
     * Webview of the application, all the elements will be displayed
     * in this webview.
     */
    private WebView webview;
    
    @Override
    public void start(Stage primaryStage) throws Exception {
        StackPane root = new StackPane();
        
        // init dahuapp
        initDahuApp();
        
        // pin it to stackpane
        root.getChildren().add(webview);
        
        // create the sceen
        Scene scene = new Scene(root, 640, 480);

        primaryStage.setTitle("DahuApp Editor");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
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
     * Initialises the webview with the html content and binds the drivers
     * to the dahuapp javascript object.
     */
    private void initDahuApp() {
        webview = new WebView();
        
        // load main app
        webview.getEngine().load(getClass().getResource("dahuapp.html").toExternalForm());

        // extend the webview js context
        webview.getEngine().getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>() {
            @Override
            public void changed(final ObservableValue<? extends Worker.State> observableValue, final State oldState, final State newState) {
                if (newState == State.SUCCEEDED) {
                    // load drivers
                    JSObject dahuapp = (JSObject) webview.getEngine().executeScript("window.dahuapp");
                    dahuapp.setMember("drivers", new DahuAppProxy(webview.getEngine()));
                    
                    // init engine
                    webview.getEngine().executeScript("dahuapp.editor.init();");
                }
            }
        });
    }
}
