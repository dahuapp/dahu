package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.KeyboardDriver;
import java.util.ArrayList;
import java.util.Objects;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import netscape.javascript.JSException;
import netscape.javascript.JSObject;

/**
 * Proxy for the keyboard driver.
 */
public class KeyboardDriverProxy implements Proxy {
    
    /**
     * Keyboard listener implementing the interface of Keyboard driver.
     */
    public class KeyboardListener implements KeyboardDriver.KeyboardListener {
        
        /**
         * Name of the callback ('dahuapp.editor.-callback-').
         */
        private final String callback;
        
        /**
         * Constructor.
         * @param callback Callback to call if keyCode is pressed.
         */
        public KeyboardListener(String callback) {
            this.callback = callback;
        }

        @Override
        public void keyTyped(final int keyCode) {
            // ignored
        }

        @Override
        public void keyPressed(final int keyCode) {
            // ignored
        }

        @Override
        public void keyReleased(final int keyCode) {
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    JSObject engine = (JSObject) webEngine.executeScript("window.dahuapp.editor");
                    engine.call(callback, keyCode);
                }
            });
        }
        
        /**
         * Javascript callback associated with this listener.
         * @return The callback name.
         */
        public String getCallback() {
            return callback;
        }
    }
    
    /**
     * List of listeners added to this proxy.
     */
    private ArrayList<KeyboardListener> listeners = new ArrayList<>();

    /**
     * Driver associated with this proxy.
     */
    private KeyboardDriver driver = new KeyboardDriver();
    
    /**
     * WebEngine to perform actions with the javascript.
     */
    private WebEngine webEngine;
    
    /**
     * Constructor.
     * @param webEngine Engine to perform actions with the javascript.
     */
    public KeyboardDriverProxy(WebEngine webEngine) {
        this.webEngine = webEngine;
    }
    
    /**
     * Adds a listener (javascript function) to the keyboard driver.
     * @param listener Javascript function called when a key is pressed.
     */
    public void addKeyListener(JSObject listener) throws JSException {
        final String functionName = listener.getMember("name").toString();
        switch (functionName) {
            case "undefined":
                throw new JSException("Callback function cannot be anonymous.");
            case "":
                throw new JSException("Callback function cannot be anonymous.");
            default:
                KeyboardListener kl = new KeyboardListener(functionName);
                if (!listeners.contains(kl)) {
                    listeners.add(kl);
                    driver.addKeyListener(kl);
                }
        }
    }
    
    /**
     * Removes a listener (javascript function) to the keyboard driver.
     * @param listener Javascript function called when a key is pressed.
     */
    public void removeKeyListener(JSObject listener) throws JSException {
        final String functionName = listener.getMember("name").toString();
        switch (functionName) {
            case "undefined":
                throw new JSException("Callback function cannot be anonymous.");
            case "":
                throw new JSException("Callback function cannot be anonymous.");
            default:
                for (KeyboardListener kl : listeners) {
                    if (kl.getCallback().equals(functionName)) {
                        driver.removeKeyListener(kl);
                        listeners.remove(kl);
                        return;
                    }
                }
        }
    }
    
    @Override
    public void onLoad() {
        driver.onLoad();
    }
    
    @Override
    public void onStop() {
        driver.onStop();
    }
}
