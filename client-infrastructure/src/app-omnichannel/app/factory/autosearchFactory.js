'use strict';

/*global app*/

app.factory('autosearchFactory', function($rootScope, quotessearchFactory, $filter){
    return {
        actionHandling: function(params){
            quotessearchFactory.actionHandling(params);
        },
        navigateToScreen: function(params){
            quotessearchFactory.navigateToScreen(params);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        },
        autoQuoteDropdown: function(){
            return [$filter('translate')('_MC011'),
                    $filter('translate')('_MD005'),
                    $filter('translate')('_MA002'),
                    $filter('translate')('_MC002'),
                    $filter('translate')('_AX009')];
        }
    };
});