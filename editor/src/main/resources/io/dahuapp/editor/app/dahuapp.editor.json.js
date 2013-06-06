"use strict";

/**
 * editor json module.
 * 
 * @param   editor     editor object to augment with module.
 * @param   $           jQuery
 * @returns editor extended with json module.
 */
var editor = (function(editor, $) {
    var json = (function() {

        var self = {};

        var json = {};
        var idSlide = 0;


        /* Public API */
        
        /*
         * json variable generated from a JSON file.
         * @param String stringJson String loaded from JSON file.
         */
        self.loadJson = function loadJson(stringJson) {
            json = JSON.parse(stringJson);
        };
        
        
        /*
         * Create a new presentation variable in the JSON file which will contain slides.
         */
        self.createPresentation = function createPresentation() {
            json.presentation = new Array();
        };

        /*
         * Add a new slide in the presentation variable of the JSON file.
         * @param String img Related to pathname of the image.
         * @param int mouseX Abscisa mouse position.
         * @param int mouseY Ordonate mouse position.
         */
        self.addSlide = function addSlide(img, mouseX, mouseY) {
            var slide = {
                "id": idSlide,
                "img": img,
                "idAction": 0,
                "action": new Array()
            };
            var action = {
                "id": slide.idAction,
                "type": "mouse",
                "mouseX": mouseX,
                "mouseY": mouseY
            };
            slide.idAction++;
            slide.action.push(action);
            idSlide++;
            json.presentation.push(slide);
        };

        /*
         * Add a title for the presentation.
         * @param String title Title to add.
         */
        self.addTitle = function addTitle(title) {
            json.title = title;
        };

        /*
         * Add an annotation for the presentation.
         * @param String annotation Annotation to add.
         */
        self.addAnnotatio = function addAnnotation(annotation) {
            json.annotation = annotation;
        };

        /*
         * Changes the mouse position values of the action identified by idAction
         * of the slide identified by idSlide.
         * @param int idSlide Identify the slide.
         * @param int idAction Identify the action.
         * @param int mouseX Abscisa mouse position.
         * @param int mouseY Ordinate mouse position.
         */
        self.editMouse = function editMouse(idSlide, idAction, mouseX, mouseY) {
            json.presentation[idSlide].action[idAction].mouseX = mouseX;
            json.presentation[idSlide].action[idAction].mouseY = mouseY;
        };

        /*
         * @returns {String}
         */
        self.getJson = function getJson() {
            var stringJson;
            stringJson = JSON.stringify(json);
            return formatJson(stringJson);
        };


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
        };

        return self;
    })();

    dahuapp.editor.json = json;

    return editor;
})(editor || {}, jQuery);

