package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.KeyboardDriver;
import io.dahuapp.editor.drivers.KeyboardDriver.KeyboardListener;
import java.util.Objects;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import netscape.javascript.JSException;
import netscape.javascript.JSObject;
import org.jnativehook.keyboard.NativeKeyEvent;

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
        public void keyTyped(int keyCode) {
            // ignored
        }

        @Override
        public void keyPressed(int keyCode) {
            // ignored
        }

        @Override
        public void keyReleased(int keyCode) {
            JSObject engine = (JSObject)webEngine.executeScript("window.dahuapp.engine");
            engine.call(callback, keyCode);
        }
        
        /**
         * Equals method is redefined to know when two listeners are the
         * same, in order to remove them from the listener list.
         * @param o Object to compare this with.
         * @return True if this is equals to the specified object.
         */
        @Override
        public boolean equals(Object o) {
            if (o instanceof KeyboardListener) {
                KeyboardListener k = (KeyboardListener)o;
                return k.callback.equals(this.callback);
            }
            return false;
        }

        @Override
        public int hashCode() {
            int hash = 3;
            hash = 59 * hash + Objects.hashCode(this.callback);
            return hash;
        }
    }

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
                driver.addKeyListener(new KeyboardListener(functionName));
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
                driver.removeKeyListener(new KeyboardListener(functionName));
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
