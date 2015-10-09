'use strict';
/*global app*/

app.controller('HeaderController', function($scope, $rootScope, $http, $location, $cookieStore) {	
    $rootScope.logout = function() {
        delete $rootScope.user;
        delete localStorage.username;
        delete $http.defaults.headers.common.Authentication;
        localStorage.clear();
		sessionStorage.clear();
		$cookieStore.remove('userid');
        $rootScope.staticInfo = {};
		$location.url( '/');
            
    };
});  



