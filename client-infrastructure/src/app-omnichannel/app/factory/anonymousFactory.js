'use strict';

/*global app*/

app.factory('anonymousFactory', function($rootScope, MetaModel, resourceFactory, $location){
    var authnService;
    var authnModule;

    return {
        navigateAsAnonymous: function(params){
            $rootScope.user = undefined;
            sessionStorage.username = undefined;
            
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);
            
            if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
        },
        navigateToLogin: function(params){
            authnService = undefined;
            authnModule = undefined;
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);    
        },
        navigateToLoginOtpSms: function(params){
            authnService = 'SMSTwoFactorChain';
            authnModule = undefined;
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);    
        },
        navigateToLoginOtpEmail: function(params){
            authnService = 'EmailTwoFactorChain';
            authnModule = undefined;
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);    
        },
        navigateToScreen: function(params){
            $rootScope.resourceHref = undefined;
            $rootScope.nextURL = params.inputComponent.actionURL;
            $rootScope.navigate(params.inputComponent.actionURL);
            if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
        },
        actionHandling: function(params){
            $rootScope.user = undefined;
            sessionStorage.username = undefined;
            
            $rootScope.nextURL = params.inputComponent.actionURL;
            
             if($rootScope.regionId === undefined){
                var arr = params.inputComponent.actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
            new Promise(function(resolve) {
                MetaModel.handleAction($rootScope, params.scope, params.inputComponent, undefined, params.properties, resourceFactory, params.defaultValues, $location, resolve); 
            }).then(function(){
                if(params.inputComponent.actionURL){
                    $location.path(params.inputComponent.actionURL);
                }
            });
        },
        getAuthnService: function(){
            return authnService;
        },
        getAuthnModule: function(){
            return authnModule;
        }
    };
});