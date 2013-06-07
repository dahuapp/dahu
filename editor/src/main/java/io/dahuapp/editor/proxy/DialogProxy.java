package io.dahuapp.editor.proxy;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.paint.Color;
import javafx.stage.Modality;
import javafx.stage.Stage;

/**
 * Popup proxy to allow the app to show dialogs.
 */
public class DialogProxy implements Proxy {
    
    /**
     * Primary stage (for modal dialogs).
     */
    private Stage primaryStage;
    
    /**
     * Constructor.
     * @param primaryStage For modal dialogs.
     */
    public DialogProxy(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }
    
    /**
     * Show a message in a simple popup window with a 'OK' button.
     * @param title Title of the dialog message.
     * @param message Message to display in the dialog.
     */
    public void showMessage(String title, String message) {
        final Stage stage = new Stage();
        stage.initOwner(primaryStage);
        stage.initModality(Modality.WINDOW_MODAL);
        stage.setTitle(title);
        
        Group root = new Group();
        Scene scene = new Scene(root, 300, 100, Color.color(0.9, 0.9, 0.9));
        Button btn = new Button("OK");
        btn.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent e) {
                stage.hide();
            }
        });
        btn.setPrefSize(50, 24);
        btn.setTranslateX((scene.getWidth() - btn.getPrefWidth()) / 2);
        btn.setTranslateY(2 * (scene.getHeight() - btn.getHeight()) / 3);
        root.getChildren().add(btn);
        
        Label mes = new Label(message);
        mes.setTranslateX(10);
        mes.setTranslateY(scene.getHeight() / 4);
        root.getChildren().add(mes);
        
        stage.setScene(scene);
        stage.show();
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}