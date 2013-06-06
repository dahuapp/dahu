package io.dahuapp.editor.proxy;

/**
 * Proxy for the logger driver.
 */
public class LoggerDriverProxy implements Proxy {
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
