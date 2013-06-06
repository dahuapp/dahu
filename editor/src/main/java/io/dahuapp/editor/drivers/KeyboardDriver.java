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
 * @author mathieu
 */
public class KeyboardDriver implements Driver {
    
    private WebEngine webEngine;
    private ArrayList<String> callbacks = new ArrayList<>();
    
    /**
     * @warning in the new architecture driver should not be aware of
     * webengine! driver must have proxy!!!
     */
    public KeyboardDriver(WebEngine webEngine) {
        this.webEngine = webEngine;
    }
    
    /**
     * Add a callback function.
     * 
     * @param listener
     * @throws JSException 
     */
    public void addKeyCallback(JSObject listener) throws JSException {
        System.out.println(listener);
        final String functionName = listener.getMember("name").toString();
        System.out.println(functionName);
        switch (functionName) {
            case "undefined":
                throw new JSException("Callback function cannot be anonymous.");
            case "":
                throw new JSException("Callback function cannot be anonymous.");
            default:
                callbacks.add(functionName);
        }
    }
    
    /**
     * Remove a callback function.
     * 
     * @param listener
     * @throws JSException 
     */
    public void removeKeyCallback(JSObject listener) throws JSException {
        final String functionName = listener.getMember("name").toString();
        switch (functionName) {
            case "undefined":
                throw new JSException("Callback function cannot be anonymous.");
            case "":
                throw new JSException("Callback function cannot be anonymous.");
            default:
                callbacks.remove(functionName);
        }
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
                switch (nke.getKeyCode()) {
                    
                    case NativeKeyEvent.VK_F8:
                        for (final String callback : callbacks) {
                            Platform.runLater(new Runnable() {
                                @Override
                                public void run() {
                                    JSObject editor = (JSObject)webEngine.executeScript("window.dahuapp.editor");
                                    System.out.println("F8 is pressed");
                                    editor.call(callback, "capture");
                                }
                            });
                        }
                        break;
                        
                    case NativeKeyEvent.VK_ESCAPE:
                        for (final String callback : callbacks) {
                            Platform.runLater(new Runnable() {
                                @Override
                                public void run() {
                                    // escape will throw an exception of ClassCast but due to
                                    // the fact it's undefined (see console println)
                                    System.out.println("ESC is pressed");
                                    JSObject editor = (JSObject)webEngine.executeScript("window.dahuapp.editor");
                                    editor.call(callback, "escape");
                                }
                            });
                        }
                        break;
                }
            }
            
            @Override
            public void nativeKeyTyped(NativeKeyEvent nke) {
                // nothing to do
            }
            
            @Override
            public void nativeKeyPressed(NativeKeyEvent e) {
                // nothing to do
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
