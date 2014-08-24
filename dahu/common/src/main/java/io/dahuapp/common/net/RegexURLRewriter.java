package io.dahuapp.common.net;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Regex URL Rewriter.
 */
public class RegexURLRewriter implements URLRewriter {

    Map<String, String> matchers = new HashMap();

    public RegexURLRewriter() {
        // no default matchers
    }

    public RegexURLRewriter(String pattern, String replacement) {
        addMatcher(pattern, replacement);
    }

    /**
     * Add a `pattern` -> `replacement` matcher.
     *
     * @param pattern Pattern to add.
     * @param replacement Replacement for this `pattern`.
     */
    public void addMatcher(String pattern, String replacement) {
        matchers.put(pattern, replacement);
    }

    /**
     * Remove `pattern` -> `replacement` matcher.
     * @param pattern Pattern to remove.
     */
    public void removeMatcher(String pattern) {
        matchers.remove(pattern);
    }

    @Override
    public boolean match(URL url) {
        return matchers.entrySet().
                stream().
                anyMatch(m -> patternMatch(m.getKey(), url.toExternalForm()));
    }

    @Override
    public URL rewrite(URL url) throws MalformedURLException {
        String rewrote = url.toExternalForm();

        for(String pattern : matchers.keySet()) {
            if (patternMatch(pattern, rewrote)) {
                rewrote = rewrote.replaceAll(pattern, matchers.get(pattern));
            }
        }

        return new URL(rewrote);
    }

    /**
     * Compiles the given regular expression and attempts to find a match on the given `input`.
     *
     * @param regex The expression to be compiled
     * @param input The character sequence to be matched
     *
     * @return whether or not the regular expression as a match on the input
     */
    private boolean patternMatch(String regex, String input) {
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(input);
        return m.find();
    }
}
