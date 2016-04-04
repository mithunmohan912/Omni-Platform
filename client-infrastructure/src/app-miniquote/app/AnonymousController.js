'use strict';
/*global validateLogin,showMessage*/

/*
exported AnonymousController
*/

function AnonymousController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata) {
    $rootScope.screenId = 'anonymous';
    var metadataLocation = $rootScope.metadataPath;
    OCMetadata.load($scope,metadataLocation);
    $rootScope.isAuthSuccess = false;

    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method, subsections, action, actionURL) {
        if(method === 'navigate'){
            $rootScope.nextURL = actionURL;
            $rootScope.navigate(actionURL);
        } else if(method === 'asiaQuoteScreen'){

        }
    };

    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
    };

    $scope.submit= function (nextScreenId){
	 var FormID = $('form').attr('id');		
	 validateLogin(FormID); 
	  if ($('#' + FormID).valid()) {
            if (!navigator.onLine) {
                showMessage('Network is not available', '30');
            } else {
				LoginSrv.runLogin($scope, nextScreenId);
            }
        }
    };
}




