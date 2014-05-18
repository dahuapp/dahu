package io.dahuapp.common.net;


/**
 * Implementation of a {@code ConfigurableURLStreamHandlerFactory} for Dahu.
 */
public class DahuURLStreamHandlerFactory extends ConfigurableURLStreamHandlerFactory {

    public <T> DahuURLStreamHandlerFactory(DahuFileAccessManager manager) {
        addHandler("classpath", new ClassPathURLStreamHandler());
        addHandler("dahufile", new DahuFileURLStreamHandler(manager));
    }

    public <T> DahuURLStreamHandlerFactory(ClassLoader classLoader, DahuFileAccessManager manager) {
        addHandler("classpath", new ClassPathURLStreamHandler(classLoader));
        addHandler("dahufile", new DahuFileURLStreamHandler(manager));
    }
}
