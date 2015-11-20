'use strict';
/*global app*/

app.controller('HeaderController', function($scope, $rootScope, $http, $location, $cookieStore, $resource, tmhDynamicLocale) {	
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

       $scope.setLocate = function(newlocale) {
                 
        $rootScope.newlocale = newlocale;
        angular.forEach($rootScope.localeOpts.options, function(val) {
                        if(val.value === $rootScope.newlocale){
                        $rootScope.selectedLanguage = val.description;
            }
        }); 
        $resource('ocInfra/assets/resources/i18n/' + newlocale + '.json').get(function(data) {
            $rootScope.locale = data;
            tmhDynamicLocale.set(newlocale);

        }, function() {});
    };

});  



