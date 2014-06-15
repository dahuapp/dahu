package io.dahuapp.editor.kernel.module;

import io.dahuapp.common.kernel.Module;
import io.dahuapp.driver.MediaDriver;
import io.dahuapp.driver.MediaDriver.Capture;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.scene.text.Text;
import org.controlsfx.dialog.Dialog;
import org.controlsfx.dialog.Dialog.Actions;
import org.controlsfx.dialog.DialogStyle;
import org.controlsfx.dialog.Dialogs;

import java.util.ArrayList;
import java.util.Optional;


/**
 * Media kernel module.
 */
public class Media implements Module {

    private MediaDriver.CaptureContext captureContext;

    @Override
    public void load(){
        captureContext = MediaDriver.loadCaptureContext();
    }

    public Capture takeCapture(String projectDir, String imageId) {
        if (MediaDriver.hasChanged(captureContext)){
            captureContext = MediaDriver.loadCaptureContext();
        }

        return MediaDriver.takeCapture(captureContext, projectDir, imageId);
    }

    /**
     * Prompts a popup to the user containing a text area.
     * @param title : title of the window
     * @param defaultInput : default text of the text area.
     * @return : the user's input
     */
    public String getInputPopup(String title, String defaultInput) {
        final TextArea inputText = new TextArea();
        inputText.setText(defaultInput);

        // we create a new dialog, with no owner, a title,
        // not limited to the application's limits and with a
        // native style.
        Dialog dlg = new Dialog(null, title, false, DialogStyle.NATIVE);

        // layout a custom GridPane containing the input field and label
        final GridPane content = new GridPane();
        content.setHgap(2);
        content.setVgap(1);
        content.add(new Label("Text"), 0, 0);
        content.add(inputText, 1, 0);
        GridPane.setHgrow(inputText, Priority.ALWAYS);

        // create the dialog with a custom graphic and the gridpane above as the
        // main content region
        dlg.setResizable(true);
        dlg.setIconifiable(false);
        dlg.setContent(content);
        dlg.getActions().addAll(Dialog.Actions.OK);

        // request focus on the inputText field by default (so the user can
        // type immediately without having to click first)
        Platform.runLater(new Runnable() {
            public void run() {
                inputText.requestFocus();
            }
        });

        dlg.show();
        return inputText.getText();
    }

    /**
     * Prompts a popup to the user containing a select input.
     * @param title : title of the window
     * @param targets : String containing the targets to choose from
     *                split up by a comma to facilitate the transportation of
     *                data between javascript interface and module kernel.
     * @return : the user's choice
     */
    public String getChoicePopup(String title, String targets) {
        ArrayList choices = new ArrayList<String>();
        // Transform the choices give in a string split up by comma
        // into an arraylist
        if (targets != null) {
            for (String s : targets.split(",")) {
                choices.add(s);
            }
        }

        Optional<String> response = Dialogs.create()
                .title(title)
                .style(DialogStyle.NATIVE)
                .showChoices(choices);

        String choosen = null;
        if (response.isPresent()) {
            choosen = response.get();
            choosen = choosen.split(" : ")[1];
        }
        return choosen;
    }

    /**
     * Prompts a popup to the user containing a choice box and a text area.
     * @param title : title of the window
     * @param choices : String containing the targets to choose from
     *                split up by a comma to facilitate the transportation of
     *                data between javascript interface and module kernel.
     * @return : the user's input and choice
     *              it's given by a string giving the type and the text of the title.
     *              the string is of type : 'type:text'
     */
    public String getChoiceAndInputPopup(String title, String choices, String defaultChoice, String defaultText) {
        final TextArea inputText = new TextArea();
        final ChoiceBox<String> choiceBox = new ChoiceBox<>();
        ArrayList<String> choicesArray = new ArrayList<String>();
        // Transform the choices give in a string split up by comma
        // into an arraylist
        if (choices != null) {
            for (String s : choices.split(",")) {
                choicesArray.add(s);
            }
        }
        choiceBox.setItems(FXCollections.observableArrayList(choicesArray));
        choiceBox.setValue(defaultChoice);
        inputText.setText(defaultText);
        inputText.setMaxSize(300, 70);

        // we create a new dialog, with no owner, a title,
        // not limited to the application's limits and with a
        // native style.
        Dialog dlg = new Dialog(null, title, false, DialogStyle.NATIVE);

        // layout a custom GridPane containing the input field and label
        final GridPane content = new GridPane();
        content.setHgap(2);
        content.setVgap(0);
        content.add(choiceBox, 0, 0);
        content.add(inputText, 1, 0);
        GridPane.setHgrow(choiceBox, Priority.ALWAYS);

        // create the dialog with a custom graphic and the gridpane above as the
        // main content region
        dlg.setResizable(true);
        dlg.setIconifiable(false);
        dlg.setContent(content);
        dlg.getActions().addAll(Dialog.Actions.OK);

        dlg.show();
        String result = null;
        String titleType = choiceBox.getValue();
        String titleText = inputText.getText();
        if (!"".equals(titleType) && !"".equals(titleText)) {
            result = titleType + ":" + titleText;
        }
        return result;
    }

    /**
     * Call the previous method without specific default values
     * @param title
     * @param choices
     * @return String result
     */
    public String getChoiceAndInputPopup(String title, String choices) {
        return getChoiceAndInputPopup (title, choices, choices.split(",")[0], "");
    }

    public String showInformations(String title, String info) {
        Dialog dlg = new Dialog(null, title, false, DialogStyle.NATIVE);

        // layout a custom GridPane containing the input field and label
        final GridPane content = new GridPane();
        String[] informations = info.split("\n");
        content.setHgap(2);
        content.setVgap(informations.length);
        final String[] toModify = {null};
        for (int i = 0; i < informations.length; i++) {
            String inf = informations[i];
            if ("".equals(inf)) {
                continue;
            }
            content.add(new Text(inf + "  "), 0, i);
            final Button edit = new Button("edit");
            edit.setOnAction((event) -> {
                toModify[0] = inf;
                dlg.hide();
            });
            content.add(edit, 1, i);
        }

        // create the dialog with a custom graphic and the gridpane above as the
        // main content region
        dlg.setResizable(true);
        dlg.setIconifiable(false);
        dlg.setContent(content);
        dlg.getActions().addAll(Dialog.Actions.OK);

        dlg.show();
        return toModify[0];
    }

}
