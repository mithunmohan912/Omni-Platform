'use strict';
/*global validateLogin,showMessage*/

/*
exported LoginController
*/


function loadMetadata (metadataName, screenId, $scope, $rootScope, $resource) {
    $rootScope.metadata = {};
    $scope.data = {};
    $resource(metadataName).get(function(data) {
        $rootScope.metadata[screenId] = data.metadata;
        $rootScope.title = data.metadata.title;
        $scope.screenId = screenId;
    });    
}

function checkVisibility (field) {
    if(field.visibleWhen)
        {
            var response = evaluateExpression(field.visibleWhen.expression);
            
            return response;
        }
        return true;
    }

function evaluateExpression()
    {    var response = true;
      //  response = $scope.data[expression.field] === expression.value;
        
        return response;
    }
	
	
function LoginController($scope, $rootScope, $location, $cookieStore, $http, $resource, OCRoles, tmhDynamicLocale,LoginSrv) {
    var metadataName = 'ocInfra/assets/resources/metadata/login.json';
    var screenId = 'login';
    loadMetadata(metadataName, screenId, $scope, $rootScope, $resource);
     $scope.checkvisible = function(field) {
            return checkVisibility(field);    
     };
    $rootScope.showHeader = false;	
    $scope.doaction = function(method) {
        if (method === 'submit'){
            $scope.submit();
        }
    };
    $scope.submit= function (){
	 var FormID = $('form').attr('id');		
	 validateLogin(FormID); 
	  if ($('#' + FormID).valid()) {
            if (!navigator.onLine) {
                showMessage('Network is not available', '30');
            } else {
				LoginSrv.runLogin($scope);
            }
        }
    };
}




