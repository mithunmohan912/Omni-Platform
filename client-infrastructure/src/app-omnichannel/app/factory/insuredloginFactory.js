'use strict';

/*global app*/

app.factory('insuredloginFactory', function($rootScope, MetaModel, quotessearchFactory){
    return {
        actionHandling: function(params){
          quotessearchFactory.actionHandlingWithDefaults(params); 
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        }
    };
});