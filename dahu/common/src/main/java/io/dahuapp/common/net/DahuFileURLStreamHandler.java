package io.dahuapp.common.net;

import org.apache.commons.io.FilenameUtils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;
import java.nio.file.Paths;
import java.nio.file.Path;

/**
 * URLStreamHandler for dahufile URL protocol.
 *
 * This URL stream handler will be activated
 * for URLs such as:
 * - dahufile:/some/path/to/local/file.html
 * - dahufile:/some/path/to/local/image.png
 *
 * @info http://www.cooljeff.co.uk/2009/12/12/custom-url-protocols-and-multiple-classloaders/
 */
public class DahuFileURLStreamHandler extends URLStreamHandler {

    DahuFileAccessManager dahuFileAccessManager;
    URLRewriter dahuURLRewriter;

    public DahuFileURLStreamHandler(DahuFileAccessManager manager, URLRewriter rewriter) {
        dahuFileAccessManager = manager;
        dahuURLRewriter = rewriter;
    }

    @Override
    protected URLConnection openConnection(URL url) throws IOException {
        return new DahuFileURLConnection(dahuURLRewriter.rewriteIfPossible(url));
    }

    private class DahuFileURLConnection extends URLConnection {

        public DahuFileURLConnection(URL url) {
            super(url);
        }

        @Override
        public void connect() throws IOException {
            // we do nothing here except override default behavior.
        }

        @Override
        public InputStream getInputStream() throws IOException {

            if (dahuFileAccessManager.getAllowedDirectories().stream().anyMatch(path -> getPath().startsWith(FilenameUtils.normalize(path.toString())))) {
                // @warning String.startsWith != Path.startsWith, here we must use Path.startsWith
                return new FileInputStream(getPath().toFile());
            } else {
                throw new SecurityException("Not allowed to access file " + getPath());
            }
        }

        /**
         * Return a path from URL.
         * 
         * We don't use getURL().getPath() since our URL is kind of not standard and therefore
         * calling getPath() on an URL will not return what we need.
         *
         * @return path for from URL.
         */
        protected Path getPath() {
            return Paths.get(getURL().toExternalForm().replaceFirst("^dahufile(://|:)", ""));
        }
    }
}
