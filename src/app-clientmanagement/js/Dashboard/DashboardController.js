'use strict';

/*
exported DashboardController
*/

function prepareMainNav($rootScope, $resource, $location){
	$rootScope.showHeader = true;

    $resource('assets/resources/metadata/dashboard.json').get(function(data) {
        $rootScope.dashboard = data.metadata.sections;
    });

    $rootScope.navigate = function(url, product_id) {
        $rootScope.product_id = product_id;
        $location.path(url);
    };

}


function DashboardController($scope, $rootScope, $routeParams, $location, $http, $resource) {  
	prepareMainNav($rootScope, $resource, $location);
	if($rootScope.routeParams.userId){
		localStorage.username = $rootScope.routeParams.userId;
		$rootScope.user = {
			'name': localStorage.username,
			'distributor_id': localStorage.distributorId
		};
	}   

}

   



