'use strict';

/*global app*/

app.factory('hoquoteinquireFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory, $location){
    return {
        actionHandling: function($scope, inputComponent, rootURL, properties, defaultValues){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, rootURL, properties, resourceFactory, defaultValues, $location);
        },
        navigateToScreen: function($scope, inputComponent){
            $rootScope.resourceHref = undefined;
            anonymousFactory.navigateToScreen($scope, inputComponent);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, resource.href, undefined, resourceFactory, undefined, $location);
        },
        navigateToTab: function(params){
            if(params.inputComponent.action){
                new Promise(function(resolve) {
                    MetaModel.handleAction($rootScope, params.scope, params.inputComponent, params.optionUrl, params.properties, resourceFactory, undefined, $location, resolve);
                }).then(function(){
                    if(params.inputComponent.actionURL){
                        anonymousFactory.navigateToScreen(params);
                    }
                });
            } else if(params.inputComponent.actionURL){
               anonymousFactory.navigateToScreen(params);
            }
        }
    };
});