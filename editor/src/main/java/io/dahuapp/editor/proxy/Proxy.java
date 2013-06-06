package io.dahuapp.editor.proxy;

/**
 * Interface defining what a proxy is.
 */
public interface Proxy {
    
    /**
     * Called when proxy is loaded.
     */
    public void onLoad();
    
    /**
     * Called when proxy is stopped.
     */
    public void onStop();
    
}
