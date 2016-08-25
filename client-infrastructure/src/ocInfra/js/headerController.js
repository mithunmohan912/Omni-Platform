'use strict';
/*global app*/

app.controller('HeaderController', function($scope, $rootScope, $http, $location, $resource, tmhDynamicLocale, $translate) {
    $rootScope.logout = function() {
        // logout user
        if ($rootScope.config !== undefined && $rootScope.config.authnURL !== undefined) {
            $http({
                method : 'POST',
                headers : {
                    'iPlanetDirectoryPro' : sessionStorage.tokenId,
                    'Content-Type' : 'application/json'
                },
                data : {},
                url : $rootScope.config.authnURL + '/sessions?_action=logout' + '&client_id=' + $rootScope.config.apiGatewayApiKeys.client_id + '&client_secret=' + $rootScope.config.apiGatewayApiKeys.client_secret
            }).success(function(data) {
                console.log('Logout successful');
                console.log('DATA='+data.result);
            });
        }

        delete $rootScope.user;
        delete localStorage.username;
        delete $http.defaults.headers.common.Authentication;
        $rootScope.isAuthSuccess = false;
        localStorage.clear();
        sessionStorage.clear();
        $rootScope.staticInfo = {};
        $location.url('/');
    };

    $scope.setLocate = function(newlocale) {

        $rootScope.newlocale = newlocale;
        angular.forEach($rootScope.localeOpts.options, function(val) {
            if (val.value === $rootScope.newlocale) {
                $rootScope.selectedLanguage = val.description;
            }
        });
        $resource('ocInfra/assets/resources/i18n/' + newlocale + '.json').get(function(data) {
            $rootScope.locale = data;
            tmhDynamicLocale.set(newlocale);
            $translate.use(newlocale);  

        }, function() {});


    };

    $resource('assets/resources/metamodel/header.json').get(function(data) {

        $rootScope.headermetamodel = data.metamodel;
    }, function() {});

});
