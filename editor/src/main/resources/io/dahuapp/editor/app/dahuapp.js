"use strict";

/**
 * Dahuapp core module.
 *
 * @param   window      window javascript object.
 * @param   $           jQuery
 * @returns dahuapp core module.
 */
(function (window, $) {
    var dahuapp = (function () {

        var self = {};

        /* private API */

        var DahuScreencastGenerator = function () {

            /*
             * Format the specified string in a readable format.
             */
            function htmlFormat(htmlString) {
                var i;
                var readableHTML = htmlString;
                var lb = '\n';
                var htags = ["<html", "</html>", "</head>", "<title", "</title>", "<meta", "<link", "</body>"];
                for (i = 0; i < htags.length; ++i) {
                    var hhh = htags[i];
                    readableHTML = readableHTML.replace(new RegExp(hhh, 'gi'), lb + hhh);
                }
                var btags = ["</div>", "</section>", "</span>", "<br>", "<br />", "<blockquote", "</blockquote>", "<ul", "</ul>", "<ol", "</ol>", "<li", "<\!--", "<script", "</script>"];
                for (i = 0; i < btags.length; ++i) {
                    var bbb = btags[i];
                    readableHTML = readableHTML.replace(new RegExp(bbb, 'gi'), lb + bbb);
                }
                var ftags = ["<img", "<legend", "</legend>", "<button", "</button>"];
                for (i = 0; i < ftags.length; ++i) {
                    var fff = ftags[i];
                    readableHTML = readableHTML.replace(new RegExp(fff, 'gi'), lb + fff);
                }
                var xtags = ["<body", "<head", "<div", "<section", "<span", "<p"];
                for (i = 0; i < xtags.length; ++i) {
                    var xxx = xtags[i];
                    readableHTML = readableHTML.replace(new RegExp(xxx, 'gi'), lb + lb + xxx);
                }
                return readableHTML;
            }

            /*
             * Generates the html header.
             */
            var generateHtmlHeader = function ($generated, cssGen) {
                $('head', $generated)
                    .append($(document.createElement('title'))
                        .append("Dahu Presentation"))/* TODO: make this customizable */
                    .append($(document.createElement('meta'))
                        .attr({'charset': 'utf-8'}))
                    .append($(document.createElement('script'))
                        .attr({'src': 'http://code.jquery.com/jquery-1.9.1.min.js'})
                        .attr({'type': 'text/javascript'}))
                    .append($(document.createElement('script'))
                        .attr({'src': 'parse-search.js'})
                        .attr({'type': 'text/javascript'}))
                    .append($(document.createElement('link'))
                        .attr({'rel': 'stylesheet', 'href': 'dahuapp.viewer.css'}))
                    .append($(document.createElement('style'))
                        .append(cssGen));
            };

            /*
             * Generates the objects.
             */

            var generateHtmlBackgroundImage = function ($generated, object) {
                $('.object-list', $generated)
                    .append($(document.createElement('img'))
                        .attr({'src': object.img, 'alt': object.img, 'class': 'background ' + object.id}));
            };
            var generateHtmlTooltip = function ($generated, object) {
                $('.object-list', $generated)
                    .append($(document.createElement('div'))
                        .attr({'class': 'tooltip ' + object.id})
                        .append(object.text));
            };

            var generateCssTooltip = function ($generated, object) {
                var style = [];

                if( object.color != null ) {
                    style.push('background-color:   ' + object.color);
                }
                if( object.width != null ) {
                    style.push('width:  ' + object.width);
                }

                if( style.length != 0 ) {
                    $generated.append(
                    '.' + object.id + '{' + style.join(';') + '}\n');
                }

                return $generated;
            };

            /*
             * Returns the code used to call the viewer to the presentation.
             */
            var getBasicCallCode = function (jsonModel) {
                var code = '(function($) {\n';
                code += '    var myPresentation = dahuapp.viewer.createDahuViewer("#my-dahu-presentation", window.getParams);\n';
                code += '    myPresentation.load(' + jsonModel + ');\n';
                code += '    myPresentation.start();\n';
                code += '})(jQuery);\n';
                return code;
            };

            /*
             * Generates the html body.
             */
            var generateHtmlBody = function ($generated, jsonModel, jsonGen) {
                $('body', $generated)
                    /* We could use a <section> here too, but it does not work with MS IE 8.
                     Alternatively, adding this in the header would work:

                     <!--[if lt IE 9]>
                     <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
                     <![endif]-->
                     */
                    .append($(document.createElement('div'))
                        .attr({'id': 'my-dahu-presentation'}))
                    .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.js'})
                        .attr({'type': 'text/javascript'}))
                    .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.viewer.js'})
                        .attr({'type': 'text/javascript'}))
                    .append($(document.createElement('script'))
                        .attr({'type': 'text/javascript'})
                        .append(getBasicCallCode(jsonGen)));
                $('#my-dahu-presentation', $generated)
                    .append($(document.createElement('div'))
                        .attr({'id': 'loading'}).append("Loading presentation..."))
                    .append($(document.createElement('div'))
                        .attr({'class': 'object-list',
                            'style': 'display: none'}))
                    .append($(document.createElement('div'))
                        .attr({'class': 'control'}));

                /* Adding the objects to the page */
                $.each(jsonModel.getObjectList(), function (id, object) {
                    switch (object.type) {
                        case "background":
                            generateHtmlBackgroundImage($generated, object);
                            break;
                        case "tooltip":
                            generateHtmlTooltip($generated, object);
                            break;
                        /* no mouse image generated here */
                    }
                });

                /* Warning here, i'm not sure if $.each is always over, here */

                /* Adding the control buttons to the page */
                $('.control', $generated)
                    .css({'top': (jsonModel.getImageHeight() + 16) + 'px'})
                    .append($(document.createElement('button'))
                        .attr({'class': 'previous'})
                        .append('Previous'))
                    .append($(document.createElement('button'))
                        .attr({'class': 'next'})
                        .append('Next'));

                /* Adding the mouse cursor image */
                $('.object-list', $generated)
                    .append($(document.createElement('div'))
                        .attr({'class': 'mouse-cursor'})
                        .append($(document.createElement('img'))
                            .attr({'src': 'img/cursor.png', 'alt': 'img/cursor.png', 'class': 'mouse-cursor-normal'}))
                        .append($(document.createElement('img'))
                            .attr({'src': 'img/cursor-pause.png', 'alt': 'img/cursor-pause.png',
                                'style': 'display: none', 'class': 'mouse-cursor-pause'})));
            };

            /*
             * Generates the css String with the Json model.
             */
            this.generateCssString = function (jsonModel) {
                var $generated = $('<style></style>');

                /* Going through each object */
                $.each(jsonModel.getObjectList(), function (id, object) {
                    switch (object.type) {
                        case "tooltip":
                            generateCssTooltip($generated, object);
                            break;
                        /* no mouse image generated here */
                    }
                });

                return $generated.text();
            }

            /*
             * Generates the html String with the Json model.
             */
            this.generateHtmlString = function (jsonModel, jsonGen, cssGen) {
                /* Initialising the compilation area */
                var $generated = $(document.createElement('div'));

                /* We create the html using the json */
                $generated.append($(document.createElement('html'))
                    .attr({'lang': 'en'}));
                $('html', $generated)
                    .append($(document.createElement('head')))
                    .append($(document.createElement('body')));

                generateHtmlHeader($generated, cssGen);
                generateHtmlBody($generated, jsonModel, jsonGen);

                var result = htmlFormat($generated.html());

                return '<!DOCTYPE html>\n' + result;
            };

            /*
             * Generates the generated JSON using the JSONmodel.
             * @param {object} jsonModel The json model to transform.
             * @param {java.awt.Dimension} imgDim The dimension of images.
             */
            this.generateJsonString = function (jsonModel, imgDim) {
                var generated = self.createScreencastGeneratedModel();
                generated.setImageSize(imgDim.width, imgDim.height);
                generated.setInitialBackground(jsonModel.getInitialBackground());
                generated.setInitialMousePos(jsonModel.getInitialMousePos());
                for (var i = 0; i < jsonModel.getNbSlide(); i++) {
                    var actionList = jsonModel.getActionList(i);
                    for (var j = 0; j < actionList.length; j++) {
                        /* 
                         * We don't add the two first actions of the first slide
                         * because they are present in the presentation metadata.
                         * It corresponds to the mouse initial pos and first background.
                         */
                        if (i > 0 || j > 1) {
                            generated.addAction(actionList[j], imgDim.width, imgDim.height);
                        }
                    }
                }
                return generated.getJson();
            };
        };

        /*
         * Model for a JSON object that will only be used by the viewer, never
         * saved on a file, used to transform the properties of actions
         * specified on the JSON file of a presentation to executable
         * functions for each action.
         */
        var DahuScreencastExecutableModel = function () {

            /* Private API */

            var json = {
                metaData: {},
                action: new Array()
            };

            /*
             * Creates a functions representing the specified action, and adds
             * it to this object.
             * @param {object} action
             */
            var addExecutableAction = function (action) {
                var executableAction = {
                    'id': action.id,
                    'trigger': action.trigger,
                    'target': action.target,
                    'delayAfter': action.delayAfter,
                    'doneFunction': function (events, selector) {
                        setTimeout(function () {
                            events.onActionOver.publish(events, selector);
                        }, this.delayAfter);
                    }
                };
                if (executableAction.delayAfter == null) {
                    executableAction.delayAfter = 200;
                }
                switch (action.type.toLowerCase()) {
                    case "appear":
                        executableAction.abs = (action.abs * json.metaData.imageWidth) + 'px';
                        executableAction.ord = (action.ord * json.metaData.imageHeight) + 'px';
                        executableAction.duration = action.duration;
                        executableAction.execute = function (events, selector) {
                            events.onActionStart.publish(events, selector);
                            var sel = selector + ' .' + this.target;
                            $(sel).css({
                                'left': this.abs,
                                'top': this.ord
                            });
                            $(sel).show(this.duration, function () {
                                executableAction.doneFunction(events, selector);
                            });
                        };
                        executableAction.executeReverse = function (selector) {
                            $(selector + ' .' + this.target).hide();
                        };
                        executableAction.executeImmediately = function (selector) {
                            var sel = selector + ' .' + this.target;
                            $(sel).css({
                                'left': this.abs,
                                'top': this.ord
                            });
                            $(sel).show();
                        };
                        break;
                    case "disappear":
                        executableAction.duration = action.duration;
                        executableAction.execute = function (events, selector) {
                            events.onActionStart.publish(events, selector);
                            $(selector + ' .' + this.target).hide(this.duration, function () {
                                executableAction.doneFunction(events, selector);
                            });
                        };
                        executableAction.executeReverse = function (selector) {
                            $(selector + ' .' + this.target).show();
                        };
                        executableAction.executeImmediately = function (selector) {
                            $(selector + ' .' + this.target).hide();
                        };
                        break;
                    case "move":
                        executableAction.finalAbs = (action.finalAbs * json.metaData.imageWidth) + 'px';
                        executableAction.finalOrd = (action.finalOrd * json.metaData.imageHeight) + 'px';
                        executableAction.duration = action.duration;
                        executableAction.speed = action.speed;
                        executableAction.execute = function (events, selector) {
                            events.onActionStart.publish(events, selector);
                            var sel = selector + ' .' + this.target;
                            this.initialAbs = $(sel).css('left');
                            this.initialOrd = $(sel).css('top');
                            if (this.duration == null) {
                                var initialAbsPix = this.initialAbs.replace('px', '');
                                var initialOrdPix = this.initialOrd.replace('px', '');
                                var finalAbsPix = this.finalAbs.replace('px', '');
                                var finalOrdPix = this.finalOrd.replace('px', '');
                                var distance = Math.sqrt(Math.pow(finalAbsPix - initialAbsPix, 2) +
                                    Math.pow(finalOrdPix - initialOrdPix, 2));
                                if (!this.speed) {
                                    this.speed = .8; // in pixel per milisecond: fast, but not too much.
                                }
                                this.duration = distance + this.speed;
                                if (this.duration < 200) { // Slow down a bit for short distances.
                                    this.duration = 200;
                                }
                            }
                            $(sel).animate({
                                'left': this.finalAbs,
                                'top': this.finalOrd
                            }, this.duration, 'linear', function () {
                                executableAction.doneFunction(events, selector);
                            });
                        };
                        executableAction.executeReverse = function (selector) {
                            $(selector + ' .' + this.target).css({
                                'left': this.initialAbs,
                                'top': this.initialOrd
                            });
                        };
                        executableAction.executeImmediately = function (selector) {
                            var sel = selector + ' .' + this.target;
                            this.initialAbs = $(sel).css('left');
                            this.initialOrd = $(sel).css('top');
                            $(sel).css({
                                'left': this.finalAbs,
                                'top': this.finalOrd
                            });
                        };
                        break;
                    case "delay":
                        executableAction.duration = action.duration;
                        executableAction.execute = function (events, selector) {
                            events.onActionStart.publish(events, selector);
                            setTimeout(function () {
                                events.onActionOver.publish(events, selector);
                            }, this.duration);
                        };
                        executableAction.executeReverse = function (selector) {
                            // Nothing!
                        };
                        executableAction.executeImmediately = function (selector) {
                            // Nothing too!
                        };
                        break;
                }
                json.action.push(executableAction);
            };

            /* Public API */

            /*
             * Loads the specified JSON read from a 'presentation.json' file,
             * and stores the functions representing each actions in an object.
             * @param {object} jsonToLoad
             */
            this.loadJson = function (jsonToLoad) {
                json.metaData = jsonToLoad.metaData;
                for (var i = 0; i < jsonToLoad.action.length; i++) {
                    addExecutableAction(jsonToLoad.action[i]);
                }
            };

            /*
             * Returns the object containing the functions.
             */
            this.getJson = function () {
                return json;
            };
        };

        /*
         * Used to transform the 'dahu' file to a JSON file used by the viewer,
         * which only contains some metaData and a list of actions.
         */
        var DahuScreencastGeneratedModel = function () {

            /* Private API */

            var json = {
                metaData: {},
                action: new Array()
            };

            /* Public API */

            /*
             * Returns a string representation of this json.
             * @returns {String}
             */
            this.getJson = function () {
                return JSON.stringify(json, null, '    ');
            };

            /*
             * Setters for the generated json metadata.
             */
            this.setImageSize = function (width, height) {
                json.metaData.imageWidth = width;
                json.metaData.imageHeight = height;
            };

            this.setInitialMousePos = function (pos) {
                json.metaData.initialMouseX = pos.x;
                json.metaData.initialMouseY = pos.y;
            };

            this.setInitialBackground = function (id) {
                json.metaData.initialBackgroundId = id;
            };

            this.addAction = function (action) {
                json.action.push(action);
            };

            /*
             * Transforms a JSON containing action properties to a JSON containing
             * the execution functions.
             * @param {Object} json
             * @returns {Object} A json object containing the execution functions
             * for all the actions of the presentation.
             */
            this.toExecutableList = function (json) {
                var executableList = {
                    metaData: json.metaData,
                    action: new Array()
                };
                for (var i = 0; i < json.action.length; i++) {
                    addExecutableAction(executableList, json.action[i]);
                }
                return executableList;
            };
        };

        /*
         * Represents a 'dahu' file for a project.
         */
        var DahuScreencastModel = function () {

            /* Private API */

            var json = {};

            /*
             * Generates a unique action ID.
             *
             * With this implementation, this ID is unique as long as the user
             * doesn't replace it manually with a not kind value or replace
             * the nextUniqueId with bad intentions.
             * But maybe that a UUID is a bit tiresome to put as an anchor...
             */
            var generateUniqueActionId = function () {
                json.metaData.nextUniqueId++;
                return json.metaData.nextUniqueId.toString();
            };

            /*
             * This method checks if the json representing a dahu project is
             * in the good version. It's in case a project file was created
             * with a previous version of Dahu, and that some fields are
             * missing.
             *
             * It doesn't control each field (at the moment) but only the
             * fields that can be missing due to a new Dahu version and not
             * to a manual editing.
             *
             * This method doesn't check any Json syntax or something like that.
             */
            var upgradeJsonVersion = function () {
                // Checks if unique IDs are in the project file
                if (!json.metaData.nextUniqueId) {
                    var currentId = 0;
                    for (var i = 0; i < json.data.length; i++) {
                        for (var j = 0; j < json.data[i].action.length; j++) {
                            json.data[i].action[j].id = currentId.toString();
                            currentId++;
                        }
                    }
                    json.metaData.nextUniqueId = currentId;
                }
            };

            /* Public API */

            /*
             * json variable generated from a JSON file.
             * @param String stringJson String loaded from JSON file.
             */
            this.loadJson = function (stringJson) {
                json = JSON.parse(stringJson);
                upgradeJsonVersion();
            };

            /*
             * Create a new presentation variable in the JSON file which will contain slides.
             */
            this.createPresentation = function (width, height) {
                json.metaData = {};
                json.metaData.imageWidth = width;
                json.metaData.imageHeight = height;
                json.metaData.nextUniqueId = 0;
                json.data = new Array();
            };

            /*
             * Add a new slide in the presentation variable of the JSON file.
             * @param int index wanted for the slide.
             * @param String idSlide Unique identifier for the slide.
             * @param String img Related to pathname of the image.
             * @param double mouseX Abscissa mouse position in %.
             * @param double mouseY Ordinate mouse position in %.
             * @return Index of the newly added slide.
             */
            this.addSlide = function (indexSlide, idSlide, img, mouseX, mouseY, speed) {
                var slide = {
                    "object": new Array(),
                    "action": new Array()
                };
                json.data.splice(indexSlide, 0, slide);
                this.addObject(indexSlide, "background", idSlide, img);
                this.addObject(indexSlide, "mouse");
                this.addAction(indexSlide, "move", json.data[indexSlide].object[1].id, "onClick", mouseX, mouseY, speed);
                this.addAction(indexSlide, "appear", json.data[indexSlide].object[0].id, "afterPrevious");
            };

            /*
             * Object factory.
             * Add a new Object in the slide idSlide.
             * @param int idSlide
             * @param string type
             * Other params can be specified depending on the object's type.
             */
            this.addObject = function (idSlide, type) {
				var object = {
                    "type": type
                };
                switch (type.toLowerCase()) {
                    case "background":
                        object.id = arguments[2] + json.data[idSlide].object.length;
                        object.img = arguments[3] || "";
                        break;
                    case "mouse":
                        object.id = "mouse-cursor";
                        break;
                    case "tooltip":
                        /*
                         * TODO: we'll need a more robust unique name
                         * when we start actually using this.
                         */
                        object.id = "s" + idSlide + "-o" + json.data[idSlide].object.length;
                        object.text = arguments[2] || "";
                        object.color = arguments[3] || null;
						object.width = arguments[4] || "";
						json.data[idSlide].object.push(object);
						var objectLength = json.data[idSlide].object.length;
						var last = json.data[idSlide].object[objectLength-1];
						json.data[idSlide].object[objectLength-1] = 
								json.data[idSlide].object[objectLength-2];
						json.data[idSlide].object[objectLength-2] = last;
                        break;
                }
				if(type.toLowerCase() != "tooltip"){
					json.data[idSlide].object.push(object);
				}
            };

            /*
             * Action factory.
             * Add a new Action in the slide idSlide whose target is the id of an object.
             * Three types of trigger : "withPrevious", "afterPrevious", "onClick".
             * @param int idSlide
             * @param string type
             * @param string target
             * @param string trigger
             * Other params can be specified depending on the object's type.
             */
            this.addAction = function (idSlide, type, target, trigger) {
                var action = {
                    "id": generateUniqueActionId(),
                    "type": type,
                    "target": target,
                    "trigger": trigger
                };
                switch (type.toLowerCase()) {
                    case "appear":
                        action.abs = arguments[4] || 0.0;
                        action.ord = arguments[5] || 0.0;
                        action.duration = arguments[6] || 0;
                        break;
                    case "disappear":
                        action.duration = arguments[4] || 0;
                        break;
                    case "move":
                        action.finalAbs = arguments[4] || 0.0;
                        action.finalOrd = arguments[5] || 0.0;
                        action.speed = arguments[6] || 0;
                        break;
                }
                json.data[idSlide].action.push(action);
            };

            this.editMouse = function (idSlide, idAction, mouseX, mouseY) {
                json.data[idSlide].action[idAction].finalAbs = mouseX;
                json.data[idSlide].action[idAction].finalOrd = mouseY;
            };

            /*
             * Sets a title for the presentation.
             * @param String title Title to set.
             */
            this.setTitle = function (title) {
                json.metaData.title = title;
            };

            /*
             * Sets an annotation for the presentation.
             * @param String annotation Annotation to set.
             */
            this.setAnnotation = function (annotation) {
                json.metaData.annotation = annotation;
            };

            /*
             * Inverts the two slides (their positions on the table).
             * @param int idSlide1 Index of the first slide.
             * @param int idSlide2 Index of the second slide.
             */
            this.invertSlides = function (idSlide1, idSlide2) {
                var tmp = json.data[idSlide1];
                json.data[idSlide1] = json.data[idSlide2];
                json.data[idSlide2] = tmp;
            };

            /*
             * Inverts the two actions (their positions on the table).
             * @param int idSlide
             * @param int idAction1
             * @param int idAction2
             */
            this.invertActions = function (idSlide, idAction1, idAction2) {
                var tmp = json.data[idSlide].action[idAction1];
                json.data[idSlide].action[idAction1] = json.data[idSlide].action[idAction2];
                json.data[idSlide].action[idAction2] = tmp;
            };

            /*
             * Returns the actions on the specified slide.
             * @returns {Array}
             */
            this.getActionList = function (idSlide) {
                return json.data[idSlide].action;
            };

            /*
             * Catches all the objects of the presentation
             * @returns {Array} List of objects of the presentation
             */
            this.getObjectList = function () {
                var objectList = new Array();
                var indexSlide = 0;
                while (json.data[indexSlide]) {
                    var indexObject = 0;
                    while (json.data[indexSlide].object[indexObject]) {
                        objectList.push(json.data[indexSlide].object[indexObject]);
                        indexObject++;
                    }
                    indexSlide++;
                }
                return objectList;
            };

            /*
             * Returns an array containing all the background images.
             * @returns {Array} List of background images.
             */
            this.getImageList = function () {
                var list = new Array();
                var indexSlide = 0;
                while (json.data[indexSlide]) {
                    list.push(json.data[indexSlide].object[0].img);
                    indexSlide++;
                }
                ;
                return list;
            };

            /*
             * Returns an object containing the id of the first background.
             * @returns {string} Id of the first background.
             */
            this.getInitialBackground = function () {
                return json.data[0].object[0].id;
            };

            /*
             * Returns an object containing the initial mouse position.
             * @returns {object} Initial position of mouse.
             */
            this.getInitialMousePos = function () {
                var pos = {};
                pos.x = json.data[0].action[0].finalAbs;
                pos.y = json.data[0].action[0].finalOrd;
                return pos;
            };

            /*
             * Removes the slide at the specified index.
             * @param {int} idSlide
             */
            this.removeSlide = function (idSlide) {
                json.data.splice(idSlide, 1);
            };

            /*
             * Removes the action at the specified slide.
             * @param {int} idSlide
             * @param {int} idAction
             */
            this.removeAction = function (idSlide, idAction) {
                json.data[idSlide].action.splice(idAction, 1);
            };

            /*
             * Removes the specified object from the slide.
             * Also removes all the actions attached to this object.
             * @param {int} idSlide
             * @param {int} idObject
             */
            this.removeObject = function (idSlide, idObject) {
                var removed = json.data[idSlide].object.splice(idObject, 1);
                for (var i = 0; i < json.data.length; i++) {
                    var j = 0;
                    while (json.data[i].action[j]) {
                        if (json.data[i].action[j].target === removed.id) {
                            json.data[i].action.splice(j, 1);
                        } else {
                            j++;
                        }
                    }
                }
            };

            /*
             * @returns {String}
             */
            this.getJson = function () {
                return JSON.stringify(json, null, '    ');
            };

            /*
             * @returns {String} returns the index for the next slide.
             */
            this.getNbSlide = function () {
                return json.data.length;
            };

            /*
             * @return {object} returns the object identified by idSlide
             */
            this.getSlide = function (idSlide) {
                return json.data[idSlide];
            };

            /*
             * Sets the size of images for the generated presentation.
             * The parameters can be null : it means there are no
             * requirement for this dimension.
             * @param {int} width New width for the generated images.
             * @param {int} height New height for the generated images.
             */
            this.setImageSizeRequirements = function (width, height) {
                json.metaData.imageWidth = width;
                json.metaData.imageHeight = height;
            };

            /*
             * Gets the width of images for the generated presentation.
             * @return {int or null} Width of generated images.
             */
            this.getImageWidth = function () {
                return json.metaData.imageWidth;
            };

            /*
             * Gets the height of images for the generated presentation.
             * @return {int or null} Height of generated images.
             */
            this.getImageHeight = function () {
                return json.metaData.imageHeight;
            };

            /*
             * Gets a background image (no one in particular, the first met).
             * @return {string} The name of a background image.
             */
            this.getABackgroundImage = function () {
                for (var i = 0; i < json.data.length; i++) {
                    for (var j = 0; j < json.data[i].object.length; j++) {
                        if (json.data[i].object[j].type === "background") {
                            return json.data[i].object[j].img;
                        }
                    }
                }
                return null;
            };
        };

        /* public API */

        self.version = "0.0.1";

        self.createScreencastGenerator = function createScreencastGenerator() {
            return new DahuScreencastGenerator();
        };

        self.createScreencastModel = function createScreencastModel() {
            return new DahuScreencastModel();
        };

        self.createScreencastExecutableModel = function createScreencastExecutableModel() {
            return new DahuScreencastExecutableModel();
        };

        self.createScreencastGeneratedModel = function createScreencastGeneratedModel() {
            return new DahuScreencastGeneratedModel();
        };

        return self;
    })();

    window.dahuapp = dahuapp;

})(window, jQuery);