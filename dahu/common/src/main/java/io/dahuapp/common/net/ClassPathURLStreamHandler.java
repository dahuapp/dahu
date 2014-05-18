package io.dahuapp.common.net;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;


/**
 * URLStreamHandler for classpath URL protocol.
 *
 * This URL stream handler will be activated
 * for URLs such as:
 * - classpath:/io/dahuapp/core/app.html
 * - classpath:/io/dahuapp/core/components/firebug-lite/skin/xp/firebug.html
 */
public class ClassPathURLStreamHandler extends URLStreamHandler {

    /**
     * The class loader to find resources from.
     */
    private final ClassLoader classLoader;

    public ClassPathURLStreamHandler() {
        this.classLoader = getClass().getClassLoader();
    }

    public ClassPathURLStreamHandler(ClassLoader classLoader) {
        this.classLoader = classLoader;
    }

    @Override
    protected URLConnection openConnection(URL u) throws IOException {
        String path = u.getPath().startsWith("/") ? u.getPath().substring(1) : u.getPath();
        URL resourceUrl = classLoader.getResource(path);

        if (resourceUrl == null) {
            throw new FileNotFoundException("Unable to load file " + path);
        }

        return resourceUrl.openConnection();
    }
}
