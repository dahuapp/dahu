'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist/io/dahuapp/core/',
        bower: 'components'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/media/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
                    'test/spec/**/*.js'
                ]
            },
            handlebars: {
                files: [
                    '<%= yeoman.app %>/scripts/templates/*.hbs'
                ],
                tasks: ['handlebars']
            },
            test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        bower: {
            install: { /* no options required, it just run bower install */}
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    src: ['http://localhost:<%= connect.test.options.port %>/app.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/media/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/<%= yeoman.bower %>',
                httpPath: 'classpath:///io/dahuapp/core/',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        requirejs: {
            // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
            app: {
                options: {
                    name: '../<%= yeoman.bower %>/almond/almond',
                    baseUrl: '<%= yeoman.app %>/scripts',
                    wrap: {
                        startFile: '<%= yeoman.app %>/scripts/configs/dahuapp/start.frag',
                        endFile: '<%= yeoman.app %>/scripts/configs/dahuapp/end.frag'
                    },
                    include: 'dahuapp',
                    insertRequire: ['dahuapp'],
                    out: '<%= yeoman.dist %>/scripts/dahuapp.js',
                    mainConfigFile: '<%= yeoman.app %>/scripts/dahuapp.js'
                }
            },
            bridge: {
                options: {
                    name: '../<%= yeoman.bower %>/almond/almond',
                    baseUrl: '<%= yeoman.app %>/scripts',
                    wrap: {
                        startFile: '<%= yeoman.app %>/scripts/configs/dahubridge/start.frag',
                        endFile: '<%= yeoman.app %>/scripts/configs/dahubridge/end.frag'
                    },
                    include: 'dahubridge',
                    insertRequire: ['dahubridge'],
                    out: '<%= yeoman.dist %>/scripts/dahubridge.js',
                    mainConfigFile: '<%= yeoman.app %>/scripts/dahubridge.js'
                }
            },
            options: {
                almond: true,
                wrapShim: true,
                optimize: 'uglify2',
                preserveLicenseComments: false,
                uglify2: {
                    // Comment out the output section to get rid of line
                    // returns and tabs spacing.
                    output: {
                        beautify: true
                    },
                    compress: false,
                    mangle: false
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/app.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        processhtml: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/app.html': ['<%= yeoman.dist %>/app.html']
                }
            },
            options: {
                commentMarker: 'process'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/media/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/media/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css',
                        '<%= yeoman.app %>/<%= yeoman.bower %>/jqueryui/themes/base/jquery-ui.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    // copy images
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'media/images/{,*/}*.{webp,gif}',
                        '<%= yeoman.bower %>/jqueryui/themes/base/images/*.*'
                    ]
                },{
                    // copy fonts
                    expand: true,
                    flatten: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '<%= yeoman.bower %>/font-awesome/fonts/*.*',
                        '<%= yeoman.bower %>/bootstrap/fonts/*.*'
                    ],
                    dest: '<%= yeoman.dist %>/fonts'
                },{
                    // copy bootstrap for modal
                    expand: true,
                    flatten: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '<%= yeoman.bower %>/bootstrap/dist/js/bootstrap.min.js',
                        '<%= yeoman.bower %>/bootstrap/dist/css/bootstrap.min.css'
                    ],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/bootstrap/'
                },{
                    // copy fontawesome for modal
                    expand: true,
                    flatten: false,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '<%= yeoman.bower %>/font-awesome/css/*',
                        '<%= yeoman.bower %>/font-awesome/fonts/*'
                    ],
                    dest: '<%= yeoman.dist %>'
                },{
                    // copy jquery for modal
                    expand: true,
                    flatten: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '<%= yeoman.bower %>/jquery/dist/jquery.min.js'
                    ],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/jquery/'
                },{
                    // copy summmernote for modal
                    expand: true,
                    flatten: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        '<%= yeoman.bower %>/summernote/dist/*'
                    ],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/summernote/'
                }]
            },
            firebuglite: {
                files: [{
                    src: '<%= yeoman.app %>/<%= yeoman.bower %>/firebug-lite/build/firebug-lite.js',
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/firebug-lite/build/firebug-lite.js'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/<%= yeoman.bower %>/firebug-lite/skin/',
                    src: ['**'],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/firebug-lite/skin/'
                }]
            },
            deckjs: {
                files: [{
                    // copy animator extension into the extensions directory of deck.js
                    expand: true,
                    cwd: '<%= yeoman.app %>/<%= yeoman.bower %>/deck.ext.js/extensions/animator/',
                    src: ['**'],
                    dest: '<%= yeoman.app %>/<%= yeoman.bower %>/deck.js/extensions/animator/'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/<%= yeoman.bower %>/deck.js/',
                    src: ['**'],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/deck.js/'
                }]
            },
            fitjs: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/<%= yeoman.bower %>/fit.js/',
                    src: ['**'],
                    dest: '<%= yeoman.dist %>/<%= yeoman.bower %>/fit.js/'
                }]
            }
        },
        // Remove logging from generated files.
        // This will remove all console.{log,dir,debug,....} functions.
        removelogging: {
            dist: {
                src: "'<%= yeoman.dist %>/**/*.js"
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.hbs']
                }
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'createDefaultTemplate',
                'handlebars',
                'compass:server',
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'createDefaultTemplate',
            'handlebars',
            'compass:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'createDefaultTemplate',
                'handlebars',
                'compass',
                'connect:test',
                'mocha'
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'bower:install',
        'clean:dist',
        'createDefaultTemplate',
        'handlebars',
        'compass:dist',
        'useminPrepare',
        'requirejs',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy',
        'usemin',
        'processhtml'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
