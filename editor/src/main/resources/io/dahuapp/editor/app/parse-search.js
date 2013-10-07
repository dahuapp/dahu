// Adapted from http://stackoverflow.com/questions/3234125/creating-array-from-window-location-hash
(function () {
    var search = window.location.search.slice(1);
    var array = search.split("&");
    
    var values, form_data = {};
    
    for (var i = 0; i < array.length; i += 1) {
	values = array[i].split("=");
	form_data[values[0]] = unescape(values[1]);
    }
    window.getParams = form_data;
}())

