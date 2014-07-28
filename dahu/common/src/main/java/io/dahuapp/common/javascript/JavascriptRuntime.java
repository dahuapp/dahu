package io.dahuapp.common.javascript;


/**
 * Base interface for Javascript Runtime.
 *
 * @param <JSObject>
 */
public interface JavascriptRuntime<JSObject> {
    Object executeScriptFile(String path);
    Object executeScriptCommand(String command);
    JSObject get(String name);
}
