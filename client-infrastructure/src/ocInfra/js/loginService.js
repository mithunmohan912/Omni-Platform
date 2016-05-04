'use strict';
/*
global app 
*/
app.service('LoginSrv', function($rootScope,$resource,  $cookieStore, $http,  OCRoles, tmhDynamicLocale, growl){	
    this.runLogin = function($scope,nextScreenId) {
				$rootScope.showIcon = true;
				 $http({
                    url: 'ocInfra/assets/resources/config/users.json',
                    method: 'GET'
                }).success(function(data) {
                    //extract user
                    var user = [];
                    $rootScope.isAuthSuccess = false;
                    angular.forEach(data.users, function(key) {
                        if (key.name === $scope.data.inputUsername && key.password === $scope.data.inputPassword) {
                            $rootScope.isAuthSuccess = true;
                            user = key;
                        }
                    });

                    if (!$rootScope.isAuthSuccess) {
                        growl.addErrorMessage($rootScope.locale.INVALID_CREDENTIALS);
                        return false;
                    }
                    $rootScope.user = user;
                    sessionStorage.distributorId = user.distributor_id;
                    sessionStorage.username = user.name;
                    sessionStorage.Authentication = user.token;
                    var defaultLocale = user.personalizationData.locale;
                    $rootScope.newlocale = defaultLocale;
                    $resource('ocInfra/assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
                        $rootScope.locale = data;
                        tmhDynamicLocale.set($rootScope.newlocale);
                        OCRoles.load(user.roles[0], nextScreenId);
                    }, function() {});
                }).error(function(data) {
                    $rootScope.showIcon = false;
                    if (data && data.exception) {
                        growl.addErrorMessage(data.exception.message, '30');
                    } else {
                        growl.addErrorMessage($rootScope.locale.GENERAL_ERROR);
                    }
                });
               
    };
});


app.service('OCRoles', function($resource, $rootScope, $location) {
    this.load = function(roleList, url) {
        $resource('ocInfra/assets/resources/config/roles.json').get(function(data) {
            angular.forEach(data.Roles, function(key) {
                if (key[roleList] !== undefined) {
                    $rootScope.roleConfig = key[roleList];
                }
            });
            if (url !== undefined) {
                $location.path(url);
            }
        });
    };
    return this;
});
