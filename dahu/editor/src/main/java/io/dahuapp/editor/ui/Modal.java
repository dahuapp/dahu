package io.dahuapp.editor.ui;

import io.dahuapp.common.javascript.WebEngineRuntime;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.text.FontSmoothingType;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebEvent;
import javafx.scene.web.WebView;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.stage.Window;
import netscape.javascript.JSObject;

/**
 * Modal implementation.
 *
 * Modal are used to open popup from JavaScript. The content
 * of the popup is an html content.
 */
public class Modal extends Stage {

    private HBox actionBar;
    private BorderPane layout;
    private WebView webView;
    private WebEngineRuntime webEngineRuntime;

    public Modal(Window owner) {
        super(StageStyle.UTILITY);

        initOwner(owner);
        initModality(Modality.APPLICATION_MODAL);
        initWebView();
        initUI();
    }

    /**
     * Return modal web view.
     * @return
     */
    public WebView getWebView() {
        return webView;
    }

    /**
     * Return modal web engine.
     * @return
     */
    public WebEngine getWebEngine() {
        return webView.getEngine();
    }

    /**
     * Return modal action bar.
     * @return
     */
    public Pane getActionBar() {
        return actionBar;
    }

    /**
     * Return WebEngine runtime.
     * @return
     */
    protected WebEngineRuntime getWebEngineRuntime() {
        return webEngineRuntime;
    }

    /**
     * Init the modal WebView.
     */
    private void initWebView() {
        webView = new WebView();
        webView.setContextMenuEnabled(false);
        webView.setFontSmoothingType(FontSmoothingType.LCD);

        // init JavascriptRuntime
        webEngineRuntime = new WebEngineRuntime(webView.getEngine());

        // capture `window.close` event
        this.webView.getEngine().setOnVisibilityChanged(new EventHandler<WebEvent<Boolean>>() {
            @Override
            public void handle(WebEvent<Boolean> event) {
                if (!event.getData()) {
                    // event.data is false when window.close() is called.
                    // when window.close() is called we want to close the stage as well.
                    hide();
                }
            }
        });

        // extend the webView js context
        webView.getEngine().getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>() {
            @Override
            public void changed(final ObservableValue<? extends Worker.State> observableValue, final Worker.State oldState, final Worker.State newState) {
                if (newState == Worker.State.SUCCEEDED) {
                    // load kernel
                    JSObject window = webEngineRuntime.get("window");
                    window.setMember("modal", new MicroKernel(Modal.this));

                    // init modal
                    webEngineRuntime.executeScriptCommand("init()");
                }
            }
        });
    }

    private void initUI() {
        // init action bar (with 5px margin)
        actionBar = new HBox();
        actionBar.setFillHeight(true);
        actionBar.setPrefHeight(36);
        actionBar.setPadding(new Insets(10, 10, 10, 10));
        actionBar.setSpacing(10);
        actionBar.setAlignment(Pos.CENTER_RIGHT);

        // init layout
        layout = new BorderPane();
        layout.setCenter(this.webView);
        layout.setBottom(actionBar);

        // init scene
        Scene dialogScene = new Scene(layout);
        setScene(dialogScene);
    }

    /**
     * Micro Kernel for modal.
     * This micro kernel expose some Modal API to the JavaScript side
     * for the internal WebView.
     */
    protected class MicroKernel {

        private Modal modal;

        public MicroKernel(Modal modal) {
            this.modal = modal;
        }

        /**
         * Set modal title.
         * @param title
         */
        public void setTitle(String title) {
            this.modal.setTitle(title);
        }

        /**
         * Set modal size.
         * @param width
         * @param height
         */
        public void setSize(int width, int height) {
            this.modal.setWidth(width);
            this.modal.setHeight(height);
        }

        /**
         * Center modal according to its parent.
         */
        public void centerOnParent() {
            Window owner = this.modal.getOwner();
            double x = owner.getX() + (owner.getWidth() / 2) - (getWidth() / 2);
            double y = owner.getY() + (owner.getHeight() / 2) - (getHeight() / 2);
            this.modal.setX(x);
            this.modal.setY(y);
        }

        /**
         * Center modal according to the screen.
         */
        public void centerOnScreen() {
            this.modal.centerOnScreen();
        }

        /**
         * Show the modal
         */
        public void show() {
            this.modal.show();
        }

        /**
         * Return modal inner height.
         * @return
         */
        public double getInnerHeight() {
            return this.modal.getHeight() - this.modal.getActionBar().getHeight();
        }

        /**
         * Return modal inner width.
         * @return
         */
        public double getInnerWidth() {
            return Modal.this.getWidth() - Modal.this.actionBar.getWidth();
        }

        public void addActionBarButton(String name, String callback) {
            Button button = new Button(name);
            button.setOnAction(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    MicroKernel.this.modal.getWebEngineRuntime().executeScriptCommand(callback);
                }
            });
            this.modal.actionBar.getChildren().add(button);
        }
    }
}
