# Requirements

- NodeJS with NPM
- Bower (npm install -g bower)
- Grunt-CLI (npm install -g grunt-cli)

Note: npm global install might require sudo access.

# Build

Grunt task automation is integrated to Gradle.
To build the project just run:

    $ ./gradlew :dahu:core:build

During the first build this task will install all the Grunt and Bower dependencies.
Installing those dependencies might take some time...

# Update

Updating Node/Grunt dependencies is done as follow:

    $ ./gradlew :dahu:core:npm

Updating Bower dependencies is done as follow:

    $ ./gradlew :dahu:core:bower