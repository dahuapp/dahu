package io.dahuapp.common.net;


/**
 * Implementation of a {@code ConfigurableURLStreamHandlerFactory} for Dahu.
 */
public class DahuURLStreamHandlerFactory extends ConfigurableURLStreamHandlerFactory {

    public <T> DahuURLStreamHandlerFactory(DahuFileAccessManager manager, URLRewriter rewriter) {
        addHandler("classpath", new ClassPathURLStreamHandler());
        addHandler("dahufile", new DahuFileURLStreamHandler(manager, rewriter));
    }

    public <T> DahuURLStreamHandlerFactory(ClassLoader classLoader, DahuFileAccessManager manager, URLRewriter rewriter) {
        addHandler("classpath", new ClassPathURLStreamHandler(classLoader));
        addHandler("dahufile", new DahuFileURLStreamHandler(manager, rewriter));
    }
}
