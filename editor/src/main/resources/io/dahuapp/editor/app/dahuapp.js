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

        var _privateAttributeExample = ':o'; // eventually to remove

        function _privateFunctionExample(args) { // eventually to remove
            return "private hello " + args;
        }

        /* public API */

        self.version = "0.0.1";
        
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
                var ftags = ["<img", "<legend", "</legend>"];
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
            var generateHtmlHeader = function($divCompilation) {
                $('head', $($divCompilation))
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
            var generateBackgroundImage = function($divCompilation, object) {
                $('.image-list', $($divCompilation))
                        .append($(document.createElement('img'))
                        .attr({'src': object.img, 'alt': object.img, 'class': 'screen ' + object.id}));
            };
            
            /*
             * Generates the html body.
             */
            var generateHtmlBody = function($divCompilation, jsonModel) {
                $('body', $($divCompilation))
                        .append($(document.createElement('section'))
                        .attr({'id': 'my-dahu-presentation'}))
                        .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.js'}))
                        .append($(document.createElement('script'))
                        .attr({'src': 'dahuapp.viewer.js'}));
                $('#my-dahu-presentation', $($divCompilation))
                        .append($(document.createElement('div'))
                        .attr({'class': 'image-list'}))
                        .append($(document.createElement('div'))
                        .attr({'class': 'control'}));

                // adding the objects to the page
                $.each(jsonModel.getObjectList(), function(id, object) {
                    switch (object.type) {
                        case "background":
                            generateBackgroundImage($divCompilation, object);
                            break;
                    }
                });
                
                // adding the control buttons to the page
                $('.control', $($divCompilation))
                        .append($(document.createElement('button'))
                        .attr({'class':'previous'})
                                .append('Previous'))
                        .append($(document.createElement('button'))
                        .attr({'class':'next'})
                                .append('Next'));
            };
            
            /*
             * Generates the html String with the Json model.
             */
            this.generateHtmlString = function(jsonModel) {
                // initialising the compilation area
                $('body')
                        .append($(document.createElement('div'))
                        .attr({'id': 'private-generating-section'})
                        .hide());

                // we create the html using the json
                var $divCompilation = $('#private-generating-section')
                        .append($(document.createElement('html'))
                        .attr({'lang': 'en'}));
                $('html', $($divCompilation))
                        .append($(document.createElement('head')))
                        .append($(document.createElement('body')));
                
                generateHtmlHeader($divCompilation);
                generateHtmlBody($divCompilation, jsonModel);

                var result = htmlFormat($divCompilation.html());

                // clearing the compilation area
                $divCompilation.remove();

                return result;
            };

            /*
             * Generates the generated JSON using the JSONmodel.
             */
            this.generateJsonString = function(jsonModel) {
                // at the moment, the generated json is the same as
                // the json used for edition
                return jsonModel.getJson();
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
                var pos = 0;
                var strLen = str.length;
                var indentStr = '    ';
                var newLine = '\n';
                var char = '';
                for (var i = 0; i < strLen; i++) {
                    char = str.substring(i, i + 1);
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
                // TO DO : actualise the id of the next slide (idSlide)
            };


            /*
             * Create a new presentation variable in the JSON file which will contain slides.
             */
            this.createPresentation = function() {
                json.metaData = {
                    "nbSlide": 0
                };
                json.data = new Array();
            };

            /*
             * Add a new slide in the presentation variable of the JSON file.
             * @param String img Related to pathname of the image.
             * @param double mouseX Abscissa mouse position in %.
             * @param double mouseY Ordinate mouse position in %.
             */
            this.addSlide = function(img, mouseX, mouseY) {
                var slide = {
                    "indexObject": 0,
                    "indexAction": 0,
                    "object": new Array(),
                    "action": new Array()
                };
                var object = {
                    "id": "s" + json.metaData.nbSlide + "-o" + slide.indexObject,
                    "type": "background",
                    "img": img
                };
                slide.object.push(object);
                slide.indexObject++;
                object = {
                    "id": "s" + json.metaData.nbSlide + "-o" + slide.indexObject,
                    "type": "mouse",
                    "mouseX": mouseX,
                    "mouseY": mouseY
                };
                slide.object.push(object);
                slide.indexObject++;
                var action = {
                    "target": slide.object[1].id,
                    "type": "appear",
                    "trigger": "nextButton"
                };
                slide.action.push(action);
                slide.indexAction++;
                json.metaData.nbSlide++;
                json.data.push(slide);
            };

            /*
             * Add a title for the presentation.
             * @param String title Title to add.
             */
            this.addTitle = function(title) {
                json.metaData.title = title;
            };

            /*
             * Add an annotation for the presentation.
             * @param String annotation Annotation to add.
             */
            this.addAnnotation = function(annotation) {
                json.metaData.annotation = annotation;
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
                return json.metaData.nbSlide;
            };
            
            /*
             * @return {object} returns the object identified by idSlide
             */
            this.getSlide = function(idSlide) {
                return json.data[idSlide];
            };
        };

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