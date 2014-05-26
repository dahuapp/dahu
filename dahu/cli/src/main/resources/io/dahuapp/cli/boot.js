/**
 * Created by barraq on 26/05/14.
 */

// Nashorn is missing some JavaScript function such as setTimeout.
// Here https://gist.github.com/bripkens/8597903 we find some help
// to define those missing functions.

var setTimeout;
var clearTimeout;
var setInterval;
var clearInterval;

(function() {
    'use strict';

    var Timer = Java.type('java.util.Timer');
    var CountDownLatch = Java.type('java.util.concurrent.CountDownLatch');
    var TimeUnit = Java.type('java.util.concurrent.TimeUnit');

    var timer = new Timer('NashornEventLoop', false);
    var countDownLatch = new CountDownLatch(1);

    var taskCount = 0;

    var onTaskFinished = function() {
        taskCount--;

        if (taskCount === 0) {
            timer.cancel();
            countDownLatch.countDown();
        }
    };

    setTimeout = function(fn, millis /* [, args] */) {
        var args = [].slice.call(arguments, 2, arguments.length);

        taskCount++;
        var canceled = false;
        timer.schedule(function() {
            if (!canceled) {
                try {
                    fn.apply(window, args);
                } catch (e) {
                    print(e);
                } finally {
                    onTaskFinished();
                }
            }
        }, millis);

        return function() {
            onTaskFinished();
            canceled = true;
        };
    };

    clearTimeout = function(cancel) {
        cancel();
    };

    setInterval = function(fn, delay /* [, args] */) {
        var args = [].slice.call(arguments, 2, arguments.length);

        var cancel = null;

        var loop = function() {
            cancel = window.setTimeout(loop, delay);
            fn.apply(window, args);
        };

        cancel = window.setTimeout(loop, delay);
        return function() {
            cancel();
        };
    };

    clearInterval = function(cancel) {
        cancel();
    };
})();