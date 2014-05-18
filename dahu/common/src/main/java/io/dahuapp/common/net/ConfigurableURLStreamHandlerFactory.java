package io.dahuapp.common.net;

import java.net.URLStreamHandler;
import java.net.URLStreamHandlerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;


/**
 * Configurable URLStreamHandlerFactory which allows adding
 * new handlers to the factory.
 */
class ConfigurableURLStreamHandlerFactory implements URLStreamHandlerFactory {
    private final Map<String, URLStreamHandler> protocolHandlers;

    public ConfigurableURLStreamHandlerFactory() {
        protocolHandlers = new HashMap<String, URLStreamHandler>();
        // these two handlers are added by com.sun.webkit.network.URLs
        //addHandler("about", new com.sun.webkit.network.about.Handler());
        //addHandler("data", new com.sun.webkit.network.data.Handler());
    }

    public Set<String> getSupportedProtocols() {
        return protocolHandlers.keySet();
    }

    public void addHandler(String protocol, URLStreamHandler urlHandler) {
        protocolHandlers.put(protocol, urlHandler);
    }

    public URLStreamHandler createURLStreamHandler(String protocol) {
        return protocolHandlers.get(protocol);
    }
}
