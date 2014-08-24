package io.dahuapp.common.net;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Base interface for rewriting URL.
 */
public interface URLRewriter {
    /**
     * Return true if URLRewriter match on given URL.
     * Where matching means rewriting this URL will lead to a different URL.
     *
     * @param url URL to check.
     * @return true if rewriting match, false otherwise.
     */
    default boolean match(URL url) {
        return false;
    };

    /**
     * Rewrite `url`.
     *
     * @param url URL to rewrite.
     * @return Rewrote URL
     *
     * @throws java.net.MalformedURLException
     */
    URL rewrite(URL url) throws MalformedURLException;

    /**
     * Rewrite `url` whenever there is a match.
     *
     * @param url
     * @return
     * @throws MalformedURLException
     */
    default URL rewriteIfPossible(URL url) throws MalformedURLException {
        if (match(url)) {
            return rewrite(url);
        } else {
            return url;
        }
    }
}
