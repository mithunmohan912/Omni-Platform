'use strict';

/*global app*/

app.factory('dashboardFactory', function($rootScope, anonymousFactory){
    return {
        navigateToScreen: function(params){
            anonymousFactory.navigateToScreen(params);
        }
    };
});