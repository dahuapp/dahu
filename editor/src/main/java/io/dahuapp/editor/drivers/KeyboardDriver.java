package io.dahuapp.editor.drivers;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.application.Platform;
import javafx.scene.web.WebEngine;
import netscape.javascript.JSException;
import netscape.javascript.JSObject;
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
        public void keyTyped(int keyCode);
        public void keyPressed(int keyCode);
        public void keyReleased(int keyCode);
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
    }
    
    /**
     * Remove a callback function.
     * 
     * @param listener Listener to remove to this keyboard driver.
     */
    public void removeKeyListener(KeyboardListener listener) {
        listeners.remove(listener);
    }
    
    @Override
    public void onLoad() {
        try {
            GlobalScreen.registerNativeHook();
        } catch (NativeHookException ex) {
            Logger.getLogger(KeyboardDriver.class.getName()).log(Level.SEVERE, "There was a problem registering the native hook. {0}", ex.getMessage());
            System.exit(1);
        }
        
        // Construct the example object and initialze native hook.
        GlobalScreen.getInstance().addNativeKeyListener(new NativeKeyListener() {
            @Override
            public void nativeKeyReleased(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyReleased(nke.getKeyCode());
                }
            }
            
            @Override
            public void nativeKeyTyped(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyTyped(nke.getKeyCode());
                }
            }
            
            @Override
            public void nativeKeyPressed(NativeKeyEvent nke) {
                for (final KeyboardListener listener : listeners) {
                    listener.keyPressed(nke.getKeyCode());
                }
            }
        });
        Logger.getLogger(KeyboardDriver.class.getName()).log(Level.INFO, "Starting {0} driver", KeyboardDriver.class.getName());
    }

    @Override
    public void onStop() {
        GlobalScreen.unregisterNativeHook();
        Logger.getLogger(KeyboardDriver.class.getName()).log(Level.INFO, "Stopping {0} driver", KeyboardDriver.class.getName());
    }
}
