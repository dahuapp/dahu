"use strict";

/**
 * Dahuapp core module.
 * 
 * @param   window      window javascript object.
 * @param   $           jQuery
 * @returns dahuapp core module.
 */
(function(window, $) {
    var dahuapp = (function() {

        var self = {};

        /* private API */

        var DahuScreencastGenerator = function() {

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
            var generateHtmlHeader = function($generated) {
                $('head', $generated)
                        .append($(document.createElement('meta'))
                        .attr({'charset': 'utf-8'}))
                        .append($(document.createElement('script'))
                        .attr({'src': 'http://code.jquery.com/jquery-1.9.1.min.js'}))
                        .append($(document.createElement('link'))
                        .attr({'rel': 'stylesheet', 'href': 'dahuapp.viewer.css'}));
            };

            /*
             * Generates a background image.
             */
            var generateBackgroundImage = function($generated, object) {
                $('.object-list', $generated)
                        .append($(document.createElement('img'))
                        .attr({'src': object.img, 'alt': object.img, 'class': 'screen ' + object.id}));
            };

            /*
             * Returns the code used to call the viewer to the presentation.
             */
            var getBasicCallCode = function() {
                var code = '(function($) {\n';
                code += '    myPresentation = dahuapp.viewer.createDahuViewer("#my-dahu-presentation");\n';
                code += '    myPresentation.load("presentation.json");\n';
                code += '    myPresentation.start();\n';
                code += '})(jQuery);\n';
                return code;
            };

            /*
             * Generates the html body.
             */
            var generateHtmlBody = function($generated, jsonModel) {
                $('body', $generated)
                        .append($(document.createElement('section'))
                        .attr({'id': 'my-dahu-presentation'}))
                        .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.js'}))
                        .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.viewer.js'}))
                        .append($(document.createElement('script'))
                        .append(getBasicCallCode()));
                $('#my-dahu-presentation', $generated)
                        .append($(document.createElement('div'))
                        .attr({'class': 'object-list'}))
                        .append($(document.createElement('div'))
                        .attr({'class': 'control'}));

                // adding the objects to the page
                $.each(jsonModel.getObjectList(), function(id, object) {
                    switch (object.type) {
                        case "background":
                            generateBackgroundImage($generated, object);
                            break;
                            // no mouse image generated here
                    }
                });

                //!\\ careful here, i'm not sure if $.each is always over here

                // adding the control buttons to the page
                $('.control', $generated)
                        .append($(document.createElement('button'))
                        .attr({'class': 'previous'})
                        .append('Previous'))
                        .append($(document.createElement('button'))
                        .attr({'class': 'next'})
                        .append('Next'));
                
                // adding the mouse cursor image
                $('.object-list', $generated)
                        .append($(document.createElement('img'))
                        .attr({'src': 'img/cursor.png', 'alt':'img/cursor.png', 'class':'mouse-cursor'}));
            };

            /*
             * Generates the html String with the Json model.
             */
            this.generateHtmlString = function(jsonModel) {
                // initialising the compilation area
                var $generated = $(document.createElement('div'));

                // we create the html using the json
                $generated.append($(document.createElement('html'))
                        .attr({'lang': 'en'}));
                $('html', $generated)
                        .append($(document.createElement('head')))
                        .append($(document.createElement('body')));

                generateHtmlHeader($generated);
                generateHtmlBody($generated, jsonModel);

                var result = htmlFormat($generated.html());

                return '<!DOCTYPE html>\n' + result;
            };

            /*
             * Generates the generated JSON using the JSONmodel.
             * @param {object} jsonModel The json model to transform.
             * @param {java.awt.Dimension} imgDim The dimension of images.
             */
            this.generateJsonString = function(jsonModel, imgDim) {
                var generated = self.createScreencastGeneratedModel();
                generated.setImageSize(imgDim.width, imgDim.height);
                generated.setInitialBackground(jsonModel.getInitialBackground());
                generated.setInitialMousePos(jsonModel.getInitialMousePos());
                for (var i = 0; i < jsonModel.getNbSlide(); i++) {
                    var actionList = jsonModel.getActionList(i);
                    for (var j = 0; j < actionList.length; j++) {
                        // We don't add the two first actions of the first slide
                        // because they are present in the presentation metadata.
                        // It corresponds to the mouse initial pos and first background.
                        if (i > 0 || j > 1) {
                            generated.addAction(actionList[j]);
                        }
                    }
                }
                return generated.getJson();
            };
        };
        
        var DahuScreencastGeneratedModel = function() {
            
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
            this.getJson = function() {
                return JSON.stringify(json, null, '    ');
            };
            
            /*
             * Setters for the generated json metadata.
             */
            this.setImageSize = function(width, height) {
                json.metaData.imageWidth = width;
                json.metaData.imageHeight = height;
            };
            
            this.setInitialMousePos = function(pos) {
                json.metaData.initialMouseX = pos.x;
                json.metaData.initialMouseY = pos.y;
            };
            
            this.setInitialBackground = function(id) {
                json.metaData.initialBackgroundId = id;
            };
            
            this.addAction = function(action) {
                json.action.push(action);
            };
        };

        var DahuScreencastModel = function() {

            /* Private API */

            var json = {};

            /* Public API */

            /*
             * json variable generated from a JSON file.
             * @param String stringJson String loaded from JSON file.
             */
            this.loadJson = function(stringJson) {
                json = JSON.parse(stringJson);
            };

            /*
             * Create a new presentation variable in the JSON file which will contain slides.
             */
            this.createPresentation = function() {
                json.metaData = {};
                json.metaData.imageWidth = 0; // 0 means not imposed
                json.metaData.imageHeight = 0; // idem
                json.data = new Array();
            };

            /*
             * Add a new slide in the presentation variable of the JSON file.
             * @param int ID wanted for the slide.
             * @param String img Related to pathname of the image.
             * @param double mouseX Abscissa mouse position in %.
             * @param double mouseY Ordinate mouse position in %.
             * @return Index of the newly added slide.
             */
            this.addSlide = function(idSlide, img, mouseX, mouseY) {
                var slide = {
                    "object": new Array(),
                    "action": new Array()
                };
                json.data.splice(idSlide, 0, slide);
                this.addObject(idSlide, "background", img);
                this.addObject(idSlide, "mouse");
                this.addAction(idSlide, "move", json.data[idSlide].object[1].id, "onClick", mouseX, mouseY, 800);
                this.addAction(idSlide, "appear", json.data[idSlide].object[0].id, "afterPrevious");
            };

            /*
             * Object factory.
             * Add a new Object in the slide idSlide.
             * @param int idSlide
             * @param string type
             * Other params can be specified depending on the object's type.
             */
            this.addObject = function(idSlide, type) {
                var object = {
                    "type": type
                };
                switch (type.toLowerCase()) {
                    case "background":
                        object.id = "s" + idSlide + "-o" + json.data[idSlide].object.length;
                        object.img = arguments[2] || "";
                        break;
                    case "mouse":
                        object.id = "mouse-cursor";
                        break;
                }
                json.data[idSlide].object.push(object);
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
            this.addAction = function(idSlide, type, target, trigger) {
                var action = {
                    "type": type,
                    "target": target,
                    "trigger": trigger
                };
                switch (type.toLowerCase()) {
                    case "appear":
                        action.abs = arguments[4] || 0.0;
                        action.ord = arguments[5] || 0.0;
                        action.duration = arguments[6] || 0;
                        action.execute = function(selector, imgWidth, imgHeight) {
                            events.onActionStart.publish(selector, imgWidth, imgHeight);
                            var sel = selector + ' .' + this.target;
                            $(sel).css({
                                'left': this.abs * imgWidth + 'px',
                                'top': this.ord * imgHeight + 'px'
                            });
                            $(sel).show(this.duration, function() {
                                events.onActionOver.publish(selector, imgWidth, imgHeight);
                            });
                        }.toString();
                        action.executeReverse = function(selector, imgWidth, imgHeight) {
                            $(selector + ' .' + this.target).hide();
                        }.toString();
                        break;
                    case "move":
                        action.finalAbs = arguments[4] || 0.0;
                        action.finalOrd = arguments[5] || 0.0;
                        action.duration = arguments[6] || 0;
                        action.execute = function(selector, imgWidth, imgHeight) {
                            events.onActionStart.publish(selector, imgWidth, imgHeight);
                            var sel = selector + ' .' + this.target;
                            this.initialAbs = $(sel).css('left');
                            this.initialOrd = $(sel).css('top');
                            $(sel).animate({
                                'left': this.finalAbs * imgWidth + 'px',
                                'top': this.finalOrd * imgHeight + 'px'
                            }, this.duration, 'linear', function() {
                                events.onActionOver.publish(selector, imgWidth, imgHeight);
                            });
                        }.toString();
                        action.executeReverse = function(selector, imgWidth, imgHeight) {
                            $(selector + ' .' + target).css({
                                'left': this.initialAbs,
                                'top': this.initialOrd
                            });
                        }.toString();
                        break;
                }
                json.data[idSlide].action.push(action);
            };
            
            this.editMouse = function(idSlide, idAction, mouseX, mouseY) {
                json.data[idSlide].action[idAction].finalAbs = mouseX;
                json.data[idSlide].action[idAction].finalOrd = mouseY;
            };

            /*
             * Sets a title for the presentation.
             * @param String title Title to set.
             */
            this.setTitle = function(title) {
                json.metaData.title = title;
            };

            /*
             * Sets an annotation for the presentation.
             * @param String annotation Annotation to set.
             */
            this.setAnnotation = function(annotation) {
                json.metaData.annotation = annotation;
            };

            /*
             * Inverts the two slides (their positions on the table).
             * @param int idSlide1 Index of the first slide.
             * @param int idSlide2 Index of the second slide.
             */
            this.invertSlides = function(idSlide1, idSlide2) {
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
            this.invertActions = function(idSlide, idAction1, idAction2) {
                var tmp = json.data[idSlide].action[idAction1];
                json.data[idSlide].action[idAction1] = json.data[idSlide].action[idAction2];
                json.data[idSlide].action[idAction2] = tmp;
            };
            
            /*
             * Returns the actions on the specified slide.
             * @returns {Array}
             */
            this.getActionList = function(idSlide) {
                return json.data[idSlide].action;
            };

            /*
             * Catches all the objects of the presentation
             * @returns {Array} List of objects of the presentation
             */
            this.getObjectList = function() {
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
            this.getImageList = function() {
                var list = new Array();
                var indexSlide = 0;
                while (json.data[indexSlide]) {
                    list.push(json.data[indexSlide].object[0].img);
                    indexSlide++;
                };
                return list;
            };
            
            /*
             * Returns an object containing the id of the first background.
             * @returns {string} Id of the first background.
             */
            this.getInitialBackground = function() {
                return json.data[0].object[0].id;
            };
            
            /*
             * Returns an object containing the initial mouse position.
             * @returns {object} Initial position of mouse.
             */
            this.getInitialMousePos = function() {
                var pos = {};
                pos.x = json.data[0].action[0].finalAbs;
                pos.y = json.data[0].action[0].finalOrd;
                return pos;
            };

            /*
             * Removes the slide at the specified index.
             * @param {int} idSlide
             */
            this.removeSlide = function(idSlide) {
                json.data.splice(idSlide, 1);
            };
            
            /*
             * Removes the action at the specified slide.
             * @param {int} idSlide
             * @param {int} idAction
             */
            this.removeAction = function(idSlide, idAction) {
                json.data[idSlide].action.splice(idAction, 1);
            };
            
            /*
             * Removes the specified object from the slide.
             * Also removes all the actions attached to this object.
             * @param {int} idSlide
             * @param {int} idObject
             */
            this.removeObject = function(idSlide, idObject) {
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
            this.getJson = function() {
                return JSON.stringify(json, null, '    ');
            };

            /*
             * @returns {String} returns the index for the next slide.
             */
            this.getNbSlide = function() {
                return json.data.length;
            };

            /*
             * @return {object} returns the object identified by idSlide
             */
            this.getSlide = function(idSlide) {
                return json.data[idSlide];
            };
            
            /*
             * Sets the size of images for the generated presentation.
             * The parameters can be null : it means there are no
             * requirement for this dimension.
             * @param {int} width New width for the generated images.
             * @param {int} height New height for the generated images.
             */
            this.setImageSizeRequirements = function(width, height) {
                json.metaData.imageWidth = width;
                json.metaData.imageHeight = height;
            };
            
            /*
             * Gets the width of images for the generated presentation.
             * @return {int or null} Width of generated images.
             */
            this.getImageWidth = function() {
                return json.metaData.imageWidth;
            };
            
            /*
             * Gets the height of images for the generated presentation.
             * @return {int or null} Height of generated images.
             */
            this.getImageHeight = function() {
                return json.metaData.imageHeight;
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
        
        self.createScreencastGeneratedModel = function createScreencastGeneratedModel() {
            return new DahuScreencastGeneratedModel();
        };

        return self;
    })();

    window.dahuapp = dahuapp;

})(window, jQuery);