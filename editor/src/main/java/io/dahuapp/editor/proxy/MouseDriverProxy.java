package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.MouseDriver;

/**
 * Proxy for the Mouse Driver.
 */
public class MouseDriverProxy implements Proxy {

    /**
     * Driver associated with this proxy.
     */
    private MouseDriver driver = new MouseDriver();

    /**
     * Get abscissa of the mouse location
     *
     * @return the abscissa of the mouse location
     */
    public int getMouseX() {
        return (int) driver.getMouse().getX();
    }

    /**
     * Get ordinate of the mouse location
     *
     * @return the ordinate of the mouse location
     */
    public int getMouseY() {
        return (int) driver.getMouse().getY();
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
