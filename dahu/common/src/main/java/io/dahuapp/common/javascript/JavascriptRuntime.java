package io.dahuapp.common.javascript;


/**
 * Base interface for Javascript Runtime.
 *
 * @param <JSObject>
 */
public interface JavascriptRuntime<JSObject> {
    Object executeScript(String command);
    JSObject getJSObject(String name);
}
