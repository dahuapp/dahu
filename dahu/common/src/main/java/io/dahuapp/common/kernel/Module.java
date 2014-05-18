package io.dahuapp.common.kernel;


/**
 * Base interface for kernel Module.
 */
public interface Module {
    default public void load() {};
    default public void unload() {};
}
