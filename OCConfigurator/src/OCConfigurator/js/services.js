'use strict';

/* Services */

app.service('sharedProperties', function () {
    var isPropertyVisible = false;

    return {
        getProperty: function () {
            return isPropertyVisible;
        },
        setProperty: function(value) {
        	isPropertyVisible = value;
        }
    };
});
