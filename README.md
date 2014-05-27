Dahu Next
=========

Dahu Next is the code name of the new Dahu.
Discussions about the major changes are available on the wiki page https://github.com/dahuapp/dahu/wiki/0.4-development.

Build
-----

Building Dahu Next requires Gradle and Grunt.
Gradle is used to build and package the Java side of Dahu while Grunt is used to build and package the JavaScript side of Dahu.

### Gradle

With the help of [Gradle wrapper](http://www.gradle.org/docs/current/userguide/gradle_wrapper.html) you don't need to
install Gradle on your system to build Dahu, instead just use gradlew (on Linux and MacOS) or gradlew.bat (on Windows).

Build the whole Dahu project:

    $ ./gradlew build

Building the editor only:

    $ ./gradlew :dahu:editor:build

Running the editor:

    $ ./gradlew :dahu:editor:run

### Grunt

Grunt is a task runner for JavaScript. In Dahu Next we use Grunt for task automation (e.g. compilation, optimization, testing, etc.).
In order to setup the Grunt environment please read [note](dahu/core/README.md) from the Core sub-project.

