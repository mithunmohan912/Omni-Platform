'use strict';

/*global app*/

app.factory('preferpaperFactory', function($rootScope, gopaperlessFactory){
   return {
        actionHandling:function(params){ 
        gopaperlessFactory.actionHandling(params);
        }
    };
});