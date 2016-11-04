'use strict';

/*global app*/

app.factory('inqlocationInfoFactory', function($rootScope, hoquoteinquireFactory){
    return {
        navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        }
    };
});
