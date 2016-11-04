'use strict';

/*global app*/

app.factory('clientinquireFactory', function($rootScope, hoquoteinquireFactory){
    return {
        actionHandling: function(params){
            hoquoteinquireFactory.actionHandling(params);
        },
        navigateToScreen: function(params){
            hoquoteinquireFactory.navigateToScreen(params);
        },
        itemActionHandling: function(params){
            hoquoteinquireFactory.itemActionHandling(params);
        },
          navigateToTab: function(params){
            hoquoteinquireFactory.navigateToTab(params);
        }
    };
});