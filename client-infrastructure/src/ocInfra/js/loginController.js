'use strict';
/*global validateLogin,showMessage*/

/*
exported LoginController
*/

function LoginController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata) {
    $rootScope.screenId = 'login';
    var metadataLocation = $rootScope.metadataPath;
    OCMetadata.load($scope,metadataLocation);


    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method, subsections, action, actionURL, nextScreenId) {
        if (method === 'submit'){
            $scope.submit(nextScreenId);
        }
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



