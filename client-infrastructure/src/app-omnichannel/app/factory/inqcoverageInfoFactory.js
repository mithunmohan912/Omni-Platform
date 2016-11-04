'use strict';

/*global app*/

app.factory('inqcoverageInfoFactory', function($rootScope, hoquoteinquireFactory){
    return {
        navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        }
    };
});