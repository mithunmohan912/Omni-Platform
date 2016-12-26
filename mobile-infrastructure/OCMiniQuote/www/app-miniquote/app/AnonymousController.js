'use strict';
/*global validateLogin,showMessage*/

/*
exported AnonymousController
*/

function AnonymousController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata, MetaModel, EnumerationService, resourceFactory) {
    $rootScope.screenId = 'anonymous';
    var metamodelLocation = $rootScope.metamodelPath;
    OCMetadata.load($scope,metamodelLocation);
    $rootScope.isAuthSuccess = false;
    MetaModel.setHeaders($rootScope);
    
    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method, subsections, action, actionURL) {
        if(method === 'login'){
            $rootScope.nextURL = actionURL;
            $rootScope.navigate(actionURL);
        } else if(method === 'navigate'){
            $rootScope.resourceHref = undefined;
            $rootScope.regionId = undefined;
            $rootScope.nextURL = actionURL;
            $rootScope.navigate(actionURL);
            // if create anonymous quotes => regionId doesn't value.
            // Need to set value to create empty quote
            if($rootScope.regionId === undefined){
                var arr = actionURL.split('/');
                $rootScope.regionId = arr[1];
            }
        
            if($rootScope.regionId!=='us'){
            new Promise(function(resolve) {
                MetaModel.actionHandling(undefined, $scope, $rootScope.regionId, $rootScope.screenId, 'create', resourceFactory, undefined, false, resolve);
            }).then(function(){
                EnumerationService.loadEnumerationByTab();
            }); 
        }}
    };

    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
    };

    $scope.submit= function (nextScreenId){
	 var FormID = $('form').attr('id');		
	 validateLogin(FormID); 
	  if ($('#' + FormID).valid()) {
            if (!navigator.onLine) {
                showMessage($rootScope.locale.NETWORK_UNAVAILABLE, '30');
            } else {
				LoginSrv.runLogin($scope, nextScreenId);
            }
        }
    };
}




