// Nashorn is missing some JavaScript function such as setTimeout.
// Here https://gist.github.com/bripkens/8597903 we find some help
// to define those missing functions.
//
// @see https://blog.codecentric.de/en/2014/06/project-nashorn-javascript-jvm-polyglott/
//
// Copyright Ben Ripkens

(function(context) {
    'use strict';

    var Timer = Java.type('java.util.Timer');
    var Phaser = Java.type('java.util.concurrent.Phaser');
    var TimeUnit = Java.type('java.util.concurrent.TimeUnit');

    var timer = new Timer('jsEventLoop', false);
    var phaser = new Phaser();

    var onTaskFinished = function() {
        phaser.arriveAndDeregister();
    };

    context.setTimeout = function(fn, millis /* [, args...] */) {
        var args = [].slice.call(arguments, 2, arguments.length);

        var phase = phaser.register();
        var canceled = false;
        timer.schedule(function() {
            if (canceled) {
                return;
            }

            try {
                fn.apply(context, args);
            } catch (e) {
                print(e, e.stack);
            } finally {
                onTaskFinished();
            }
        }, millis);

        return function() {
            onTaskFinished();
            canceled = true;
        };
    };

    context.clearTimeout = function(cancel) {
        cancel();
    };

    context.setInterval = function(fn, delay /* [, args...] */) {
        var args = [].slice.call(arguments, 2, arguments.length);

        var cancel = null;

        var loop = function() {
            cancel = context.setTimeout(loop, delay);
            fn.apply(context, args);
        };

        cancel = context.setTimeout(loop, delay);
        return function() {
            cancel();
        };
    };

    context.clearInterval = function(cancel) {
        cancel();
    };

    context.main = function(fn, waitTimeMillis) {
        if (!waitTimeMillis) {
            waitTimeMillis = 60 * 1000;
        }

        if (phaser.isTerminated()) {
            phaser = new Phaser();
        }

        // we register the main(...) function with the phaser so that we
        // can be notified of all cases. If we wouldn't do this, we would have a
        // race condition as `fn` could be finished before we call `await(...)`
        // on the phaser.
        phaser.register();
        setTimeout(fn, 0);

        // timeout is handled via TimeoutException. This is good enough for us.
        phaser.awaitAdvanceInterruptibly(phaser.arrive(),
            waitTimeMillis,
            TimeUnit.MILLISECONDS);

        // a new phase will have started, so we need to arrive and deregister
        // to make sure that following executions of main(...) will work as well.
        phaser.arriveAndDeregister();
    };

    context.shutdown = function() {
        timer.cancel();
        phaser.forceTermination();
    };
})(this);