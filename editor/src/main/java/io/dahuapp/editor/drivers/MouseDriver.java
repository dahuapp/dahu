package io.dahuapp.editor.drivers;

import io.dahuapp.editor.proxy.LoggerProxy;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Toolkit;

/**
 *
 * Driver for the mouse.
 */
public class MouseDriver implements Driver {

    /**
     * getter for the mouse position
     *
     * @return The location of the mouse
     */
    public Point getMouse() {
        return MouseInfo.getPointerInfo().getLocation();
    }
    
    /**
     * 
     * @return the size of the screen Point(width, height)
     */
    public Point getMouseMax() {
        LoggerProxy.config(getClass().getName(), "getMouseMax", "screen resolution : " + Toolkit.getDefaultToolkit().getScreenSize().width + "x" + Toolkit.getDefaultToolkit().getScreenSize().height );
        return new Point(Toolkit.getDefaultToolkit().getScreenSize().width,Toolkit.getDefaultToolkit().getScreenSize().height);
    }

    @Override
    public void onLoad() {
    }

    @Override
    public void onStop() {
    }
}
