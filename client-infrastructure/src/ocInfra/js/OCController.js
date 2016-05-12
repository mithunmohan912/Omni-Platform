'use strict';

/*
exported OCController
*/

function OCController($scope, $rootScope, $routeParams, $location, $http, $resource,FieldService,OCMetadata) {  
	$rootScope.showHeader = true;
    var reqParm = null;

    if ($routeParams.screenId.indexOf(':') !== -1) {
        reqParm = $routeParams.screenId.split(':');
        $rootScope.screenId = reqParm[1];
    } else {
        reqParm = $routeParams.screenId;
        $rootScope.screenId = reqParm;
    }
    var metamodelLocation = $rootScope.config.templates.metaModel;
    OCMetadata.load($scope,metamodelLocation);
    $scope.checkvisible = function(field) {
            return FieldService.checkVisibility(field, $scope);    
     };
    $scope.doaction = function(method, subsections, action, actionURL) {
        if (method === 'navigate'){
            $scope.navigate(actionURL);
        }
    };
    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
    };
}