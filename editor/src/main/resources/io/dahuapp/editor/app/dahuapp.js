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
             * @param int mouseX Abscissa mouse position.
             * @param int mouseY Ordinate mouse position.
             */
            this.addSlide = function(img, mouseX, mouseY) {
                var slide = {
                    "indexObject": 0,
                    "indexAction": 0,
                    "object": new Array(),
                    "action": new Array()
                };
                var object = {
                    "id": slide.indexObject,
                    "type": "background",
                    "img": img
                };
                slide.object.push(object);
                slide.indexObject++;
                var object2 = {
                    "id": slide.indexObject,
                    "type": "mouse",
                    "mouseX": mouseX,
                    "mouseY": mouseY
                };
                slide.object.push(object2);
                slide.indexObject++;
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
             * @param int mouseX Abscissa mouse position.
             * @param int mouseY Ordinate mouse position.
             */
            this.editMouse = function(idSlide, mouseX, mouseY) {
                json.data[idSlide].object[1].mouseX = mouseX;
                json.data[idSlide].object[1].mouseY = mouseY;
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

        };

        self.createScreencastModel = function createScreencastModel() {
            return new DahuScreencastModel();
        };

        // eventually to remove
        self.publicFunctionExample = function publicFunctionExample(args) {
            return "public hello " + args;
        };

        return self;
    })();

    window.dahuapp = dahuapp;

})(window, jQuery);