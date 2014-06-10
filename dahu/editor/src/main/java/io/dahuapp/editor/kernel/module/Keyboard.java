package io.dahuapp.editor.kernel.module;


import io.dahuapp.common.javascript.WebEngineRuntime;
import io.dahuapp.common.kernel.Module;
import io.dahuapp.driver.KeyboardDriver;
import javafx.application.Platform;
import netscape.javascript.JSException;

import java.util.HashMap;

/**
 * Keyboard kernel module.
 *
 * Use of JavaFX UI must only happen here.
 */
public class Keyboard implements Module {

    /**
     * Keyboard listener implementing the interface of Keyboard driver.
     */
    public class KeyboardListener implements KeyboardDriver.KeyboardListener {

        /**
         * Name of the event to trigger when action on key.
         */
        private final String eventToTrigger;

        /**
         * Constructor.
         * @param eventToTrigger to call if keyCode is pressed.
         */
        public KeyboardListener(String eventToTrigger) {
            this.eventToTrigger = eventToTrigger;
        }

        @Override
        public void keyTyped(final int keyCode, final String keyName) {
            // ignored
        }

        @Override
        public void keyPressed(final int keyCode, final String keyName) {
            // ignored
        }

        @Override
        public void keyReleased(final int keyCode, final String keyName) {
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    // We trigger the event specified by eventToTrigger with
                    // the keyCode and keyName as arguments.
                    webEngineRuntime.executeScript("dahuapp.events.trigger('"+eventToTrigger+"', "+
                            keyCode +", \""+ keyName +"\");");
                }
            });
        }
    }

    /**
     * webEngineRuntime to perform actions with the javascript.
     */
    private WebEngineRuntime webEngineRuntime;

    /**
     * Constructor.
     * @param webEngineRuntime Engine to perform actions with the javascript.
     */
    public Keyboard(WebEngineRuntime webEngineRuntime) {
        this.webEngineRuntime = webEngineRuntime;
    }

    /**
     * List of listeners added to this proxy.
     */
    private HashMap<String, KeyboardListener> listeners = new HashMap<>();

    /**
     * Adds a listener (javascript event) to the keyboard driver.
     * @param listener Javascript event called when a key is pressed.
     */
    public void addKeyListener(String listener) throws JSException {
        switch (listener) {
            case "undefined":
                throw new JSException("Listener cannot be anonymous.");
            case "":
                throw new JSException("Listener cannot be anonymous.");
            default:
                if (!listeners.containsKey(listener)) {
                    KeyboardListener kl = new KeyboardListener(listener);
                    listeners.put(listener, kl);
                    KeyboardDriver.addKeyListener(kl);
                }
        }
    }

    /**
     * Removes a listener from the keyboard driver
     * @param listener Listener to remove
     */
    public void removeKeyListener(String listener) throws JSException {
        switch (listener) {
            case "undefined":
                throw new JSException("Listener cannot be anonymous.");
            case "":
                throw new JSException("Listener cannot be anonymous.");
            default:
                if (listeners.containsKey(listener)) {
                    KeyboardListener kl = listeners.remove(listener);
                    KeyboardDriver.removeKeyListener(kl);
                }
        }
    }

    /* Keyboard must not be loaded in load() because
     * it causes pthread_mutex_lock on Linux
     * We start it and stop it when we need it
     * e.g. when switching on Capture Mode
     */

    public void start(){
        KeyboardDriver.onLoad();
    }

    public void stop() {
        KeyboardDriver.onUnload();
    }
}