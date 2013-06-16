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
                var generated = self.createScreencastModel();
                generated.loadJson(jsonModel.getJson());
                generated.setImageSizeRequirements(imgDim.width, imgDim.height);
                return generated.getJson();
            };
        };

        var DahuScreencastModel = function() {

            var json = {};

            /* Private API */

            /*
             * Formats and indents JSON string.
             * @param String val Text to format.
             * @returns {String|dahuapp.editor.formatJson.retval}.
             */
            function formatJson(val) {
                var retval = '';
                var str = val;
                var str2;
                var strFunct;
                var pos = 0;
                var strLen = str.length;
                var indentStr = '    ';
                var newLine = '\n';
                var char = '';
                var formatEnable = true;
                for (var i = 0; i < strLen; i++) {
                    char = str.substring(i, i + 1);
                    str2 = str.substring(i - 2, i);
                    if (formatEnable === true) {
                        if (i > 10) {
                            strFunct = str.substring(i - 10, i);
                            if (char === '"' && strFunct === '"execute":')
                            {
                                formatEnable = false;
                            }
                        }
                        if (char === '}' || char === ']') {
                            retval = retval + newLine;
                            pos = pos - 1;
                            for (var j = 0; j < pos; j++) {
                                retval = retval + indentStr;
                            }
                        }

                        retval = retval + char;
                        if (char === '{' || char === '[' || char === ',') {
                            retval = retval + newLine;
                            if (char === '{' || char === '[') {
                                pos = pos + 1;
                            }

                            for (var k = 0; k < pos; k++) {
                                retval = retval + indentStr;
                            }
                        }
                    } else if (str2 === '}"') {
                        formatEnable = true;
                        retval = retval + char;
                    } else {
                        if (char !== '\\') {
                            retval = retval + char;
                        } else {
                            i++;
                        }
                    }
                }

                return retval;
            }

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
                    "indexObject": 0,
                    "indexAction": 0,
                    "object": new Array(),
                    "action": new Array()
                };
                json.data.splice(idSlide, 0, slide);
                this.addObject(idSlide, "background");
                this.setObjectImage(idSlide, 0, img);
                this.addObject(idSlide, "mouse");
                this.setObjectMouse(idSlide, 1, mouseX, mouseY);
                this.addAction(idSlide, json.data[idSlide].object[1].id, "onClick");
                this.setActionMove(idSlide, 0, mouseX, mouseY);
            };

            /*
             * Add a new Object in the slide idSlide.
             * @param int idSlide
             * @param string type
             */
            this.addObject = function(idSlide, type) {
                var object = {
                    "id": "s" + idSlide + "-o" + json.data[idSlide].indexObject,
                    "type": type
                };
                json.data[idSlide].object.push(object);
                json.data[idSlide].indexObject++;
            };

            /*
             * Add a new Action in the slide idSlide whose target is the id of an object.
             * Three types of trigger : "withPrevious", "afterPrevious", "onClick".
             * @param int idSlide
             * @param string target
             * @param string trigger
             */
            this.addAction = function(idSlide, target, trigger) {
                var action = {
                    "target": target,
                    "trigger": trigger
                };
                json.data[idSlide].action.push(action);
                json.data[idSlide].indexAction++;
            };

            /*
             * Set abscissa, ordinate and function for the action idAction of the Slide idSlide.
             * @param int idSlide
             * @param int idAction
             * @param int abs
             * @param int ord
             */
            this.setActionAppear = function(idSlide, idAction, abs, ord) {
                json.data[idSlide].action[idAction].finalAbs = abs;
                json.data[idSlide].action[idAction].finalOrd = ord;
                var appear = function(target, finalAbs, finalOrd) {
                    $(target).show();
                };
                json.data[idSlide].action[idAction].execute = appear.toString();
            };

            /*
             * Set abscissa, ordinate and function for the action idAction of the Slide idSlide.
             * @param int idSlide
             * @param int idAction
             * @param double finalAbs
             * @param double finalOrd
             */
            this.setActionMove = function(idSlide, idAction, finalAbs, finalOrd) {
                json.data[idSlide].action[idAction].finalAbs = finalAbs;
                json.data[idSlide].action[idAction].finalOrd = finalOrd;
                var move = function(target, finalAbs, finalOrd) {
                    $(target).animate({
                        'left': finalAbs * 100 + '\%',
                        'top': finalOrd * 100 + '\%'}, 1000);
                };
                json.data[idSlide].action[idAction].execute = move.toString();
            };

            /*
             * Set image arguments for the object idObject of the slide idSlide.
             * @param int idSlide
             * @param int idObject
             * @param int img
             */
            this.setObjectImage = function(idSlide, idObject, img) {
                json.data[idSlide].object[idObject].img = img;
            };

            /*
             * Set mouse arguments for the object idObject of the slide idSlide.
             * @param int idSlide
             * @param int idObject
             * @param int mouseX
             * @param int mouseY
             */
            this.setObjectMouse = function(idSlide, idObject, mouseX, mouseY) {
                json.data[idSlide].object[idObject].id = "mouse-cursor";
                json.data[idSlide].object[idObject].mouseX = mouseX;
                json.data[idSlide].object[idObject].mouseY = mouseY;
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
             * Changes the mouse position values of the action identified by idAction
             * of the slide identified by idSlide.
             * @param int idSlide Identify the slide.
             * @param double mouseX Abscissa mouse position in %.
             * @param double mouseY Ordinate mouse position in %.
             */
            this.editMouse = function(idSlide, mouseX, mouseY) {
                json.data[idSlide].object[1].mouseX = mouseX;
                json.data[idSlide].object[1].mouseY = mouseY;
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
             * Catches all the slides of the presentation
             * @returns {Array} List of slides of the presentation
             */
            this.getSlideList = function() {
                var slideList = new Array();
                var indexSlide = 0;
                while (json.data[indexSlide]) {
                    var indexObject = 0;
                    while (json.data[indexSlide].object[indexObject]) {
                        if (json.data[indexSlide].object[indexObject].type === 'background') {
                            slideList.push(json.data[indexSlide].object[indexObject].img);
                        }
                        indexObject++;
                    }
                    indexSlide++;
                }
                return slideList;
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
             * Removes the slide at the specified index.
             * @param {int} idSlide
             */
            this.removeSlide = function(idSlide) {
                json.data.splice(idSlide, 1);
            };

            /*
             * @returns {String}
             */
            this.getJson = function() {
                var stringJson;
                stringJson = JSON.stringify(json);
                return formatJson(stringJson);
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

        return self;
    })();

    window.dahuapp = dahuapp;

})(window, jQuery);