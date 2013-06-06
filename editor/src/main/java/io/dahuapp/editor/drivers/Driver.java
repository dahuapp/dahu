package io.dahuapp.editor.drivers;

/**
 * Common interface for drivers.
 *
 * @author barraq
 */
public interface Driver {

    /**
     * Called when driver is loaded.
     */
    public void onLoad();

    /**
     * Called when driver is stopped.
     */
    public void onStop();
}
