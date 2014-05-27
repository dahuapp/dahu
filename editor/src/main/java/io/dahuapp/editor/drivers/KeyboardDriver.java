package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
import java.util.ArrayList;
import org.jnativehook.GlobalScreen;
import org.jnativehook.NativeHookException;
import org.jnativehook.keyboard.NativeKeyEvent;
import org.jnativehook.keyboard.NativeKeyListener;

/**
 * Driver to get keyboard events.
 * It does 2 actions :
 * <ul>
 * <li>takes a screenshot when a specific key is pressed</li>
 * <li>stops the capture mode when an other specific key is pressed</li>
 * </ul>
 */
public class KeyboardDriver implements Driver {
    
    /**
     * Listeners for this driver.
     */
    public interface KeyboardListener {
        public void keyTyped(int keyCode, final String keyName);
        public void keyPressed(int keyCode, final String keyName);
        public void keyReleased(int keyCode, final String keyName);
    }
    
    /**
     * List of listeners.
     */
    private ArrayList<KeyboardListener> listeners = new ArrayList<>();
    
    /**
     * Add a listener to this driver.
     * 
     * @param listener Listener to add to this keyboard driver.
     */
    public void addKeyListener(KeyboardListener listener) {
        listeners.add(listener);
        LoggerProxy.config(getClass().getName(), "addKeyListener",
                listener.getClass().getSimpleName() + " added");
    }
    
    /**
     * Remove a callback function.
     * 
     * @param listener Listener to remove to this keyboard driver.
     */
    public void removeKeyListener(KeyboardListener listener) {
        listeners.remove(listener);
        LoggerProxy.config(getClass().getName(), "removeKeyListener",
                listener.getClass().getSimpleName() + " removed");
    }
    
    @Override
    public void onLoad() {
        try {
            GlobalScreen.registerNativeHook();
        } catch (NativeHookException ex) {
            if ( System.getProperty("os.name").toLowerCase().startsWith("mac os x") ) {
                // output it for the user
                System.err.println("There was a problem registering the native hook. " +
                        "Please enable access for assistive devices and applications to Dahu Editor.");
                // log it (users might not see the logs)
                LoggerProxy.severe(getClass().getName(),"onLoad",
                        "There was a problem registering the native hook. " +
                        "Please enable access for assistive devices and applications to Dahu Editor.",
                        ex);
            } else {
                LoggerProxy.severe(getClass().getName(), "onLoad",
                        "There was a problem registering the native hook. " + ex.getMessage()
                        ,ex);
            }

            // exit
            System.exit(1);
        }
        
        // Construct the example object and initialze native hook.
        GlobalScreen.getInstance().addNativeKeyListener(new NativeKeyListener() {
            @Override
            public void nativeKeyReleased(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyReleased(nke.getKeyCode(), NativeKeyEvent.getKeyText(nke.getKeyCode()));
                }
            }
            
            @Override
            public void nativeKeyTyped(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyTyped(nke.getKeyCode(), NativeKeyEvent.getKeyText(nke.getKeyCode()));
                }
            }
            
            @Override
            public void nativeKeyPressed(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyPressed(nke.getKeyCode(), NativeKeyEvent.getKeyText(nke.getKeyCode()));
                }
            }
        });
        LoggerProxy.info(getClass().getName(), "onLoad",
                "Starting " +  KeyboardDriver.class.getSimpleName() + " driver");
    }

    @Override
    public void onStop() {
        GlobalScreen.unregisterNativeHook();
        LoggerProxy.info(getClass().getName(), 
                "onStop", "Stopping " + KeyboardDriver.class.getSimpleName() + " driver");
    }
}
