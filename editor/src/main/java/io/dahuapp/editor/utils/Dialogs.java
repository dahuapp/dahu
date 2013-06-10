package io.dahuapp.editor.utils;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonBuilder;
import javafx.scene.control.Label;
import javafx.scene.control.LabelBuilder;
import javafx.scene.control.TextField;
import javafx.scene.control.TextFieldBuilder;
import javafx.scene.layout.HBox;
import javafx.scene.layout.HBoxBuilder;
import javafx.scene.layout.VBox;
import javafx.scene.layout.VBoxBuilder;
import javafx.scene.paint.Color;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

/**
 * Class for generating dialogs.
 */
public class Dialogs {

    /**
     * For the confirm dialog return.
     */
    private static Boolean confirmChoice;
    /**
     * For the prompt dialog return.
     */
    private static String promptResult;

    /**
     * Displays the specified message in a dialog window.
     *
     * @param message Message to display.
     */
    public static void showMessage(String message) {
        final Stage alert = new Stage(StageStyle.UTILITY);
        alert.setTitle("Dialog");
        alert.initModality(Modality.APPLICATION_MODAL);

        // label text
        Label text = LabelBuilder.create().text(message).build();
        // ok button
        Button ok = ButtonBuilder.create().text("OK").onAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent t) {
                alert.close();
            }
        }).build();

        // vbox to display the label and the button
        VBox content = VBoxBuilder.create().children(text, ok)
                .alignment(Pos.CENTER).spacing(10).padding(new Insets(10)).build();

        alert.setScene(new Scene(content, Color.LIGHTGRAY));
        alert.setResizable(false);
        alert.showAndWait();
    }

    /**
     * Shows a dialog with the specified message. The user will have the choice
     * between 'yes' and 'no'.
     *
     * @param message Message to display.
     * @return True if 'yes' was chosen, False otherwise.
     */
    public static Boolean showConfirm(String message) {
        final Stage alert = new Stage(StageStyle.UTILITY);
        alert.setTitle("Confirm");
        alert.initModality(Modality.APPLICATION_MODAL);
        confirmChoice = false;

        // label text
        Label text = LabelBuilder.create().text(message).build();
        // yes button
        Button ok = ButtonBuilder.create().text("Yes").onAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent t) {
                confirmChoice = true;
                alert.close();
            }
        }).build();
        // no button
        Button cancel = ButtonBuilder.create().text("No").onAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent t) {
                confirmChoice = false;
                alert.close();
            }
        }).build();

        // hbox containing the buttons
        HBox controls = HBoxBuilder.create().children(ok, cancel)
                .alignment(Pos.CENTER).spacing(10).build();
        // vbox to display the label and the button
        VBox content = VBoxBuilder.create().children(text, controls)
                .alignment(Pos.CENTER).spacing(10).padding(new Insets(10)).build();

        alert.setScene(new Scene(content, Color.LIGHTGRAY));
        alert.setResizable(false);
        alert.showAndWait();
        return confirmChoice;
    }

    /**
     * Shows a dialog input to allow the user to prompt a string.
     *
     * @param message Message to display.
     * @param defVal Default value for the prompt.
     * @return String entered by the user (null if cancelled).
     */
    public static String showPrompt(String message, String defVal) {
        final Stage alert = new Stage(StageStyle.UTILITY);
        alert.setTitle("Prompt");
        alert.initModality(Modality.APPLICATION_MODAL);

        // label text
        Label text = LabelBuilder.create().text(message).build();
        // input text
        final TextField input = TextFieldBuilder.create().promptText(defVal).build();
        // ok button
        Button ok = ButtonBuilder.create().text("OK").onAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent t) {
                promptResult = input.getText();
                alert.close();
            }
        }).build();
        // cancel button
        Button cancel = ButtonBuilder.create().text("Cancel").onAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent t) {
                promptResult = null;
                alert.close();
            }
        }).build();

        // hbox containing the buttons
        HBox controls = HBoxBuilder.create().children(ok, cancel)
                .alignment(Pos.CENTER).spacing(10).build();
        // vbox to display the label and the button
        VBox content = VBoxBuilder.create().children(text, input, controls)
                .alignment(Pos.CENTER).spacing(10).padding(new Insets(10)).build();

        alert.setScene(new Scene(content, Color.LIGHTGRAY));
        alert.setResizable(false);
        alert.showAndWait();
        // fix for windows (we hope this fix is as temporary as it's dirty)
        if (defVal.equals("Dahu project directory.") &&
                System.getProperty("os.name").contains("Windows")) {
            promptResult = System.getProperty("file.separator") + promptResult;
        }
        return promptResult;
    }
}
