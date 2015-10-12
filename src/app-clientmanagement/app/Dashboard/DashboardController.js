'use strict';

/*
exported DashboardController
*/

function DashboardController($scope, $rootScope, $routeParams, $location, $http, $resource) {  
	$rootScope.showHeader = true;
    var metadataName = 'assets/resources/metadata/dashboard.json';
    var screenId = 'dashboard';
    loadMetadata(metadataName, screenId, $scope, $rootScope, $resource);
     $scope.checkvisible = function(field) {
            return checkVisibility(field);    
     }
    $scope.doaction = function(method, subsections, action, actionURL) {
        if (method === 'navigate'){
            $scope.navigate(actionURL);
        }
    }
    $rootScope.navigate = function(actionURL) {
        $location.path(actionURL);
    };
    if($rootScope.routeParams.userId){
		localStorage.username = $rootScope.routeParams.userId;
		$rootScope.user = {
			'name': localStorage.username,
			'distributor_id': localStorage.distributorId
		};
	}   

}
