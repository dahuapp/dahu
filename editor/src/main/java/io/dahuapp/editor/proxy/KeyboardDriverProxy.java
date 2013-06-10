package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.KeyboardDriver;
import java.util.HashMap;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import netscape.javascript.JSException;
import netscape.javascript.JSObject;
import static org.jnativehook.keyboard.NativeKeyEvent.*;

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
                    JSObject editor = (JSObject)webEngine.executeScript("window.dahuapp.editor");
                    editor.call(callback, keyCode);
                }
            });
        }
    }
    
    /**
     * List of listeners added to this proxy.
     */
    private HashMap<String, KeyboardListener> listeners = new HashMap<>();

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
                if (!listeners.containsKey(functionName)) {
                    KeyboardListener kl = new KeyboardListener(functionName);
                    listeners.put(functionName, kl);
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
                if (listeners.containsKey(functionName)) {
                    KeyboardListener kl = listeners.remove(functionName);
                    driver.removeKeyListener(kl);
                }
        }
    }
    
    /**
     * Returns a string identifying the specified key code.
     * @param keyCode Key code to identify with a string.
     * @return A string identifying the specified keyCode.
     */
    public String keyToString(int keyCode) {
        switch (keyCode) {
            case VK_F7:
                return "f7";
            case VK_F8:
                return "f8";
            case VK_ESCAPE:
                return "escape";
            default:
                return "unknown";
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
