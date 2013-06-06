package io.dahuapp.editor.proxy;

import io.dahuapp.editor.drivers.FileSystemDriver;

/**
 * Proxy for the file system driver.
 */
public class FileSystemDriverProxy implements Proxy {
    
    /**
     * Driver associated with this proxy.
     */
    private FileSystemDriver driver = new FileSystemDriver();
    
    @Override
    public void onLoad() {
        driver.onLoad();
    }

    @Override
    public void onStop() {
        driver.onStop();
    }
}
