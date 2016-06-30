'use strict';

/*global ScreenController,CKEDITOR*/
/*
exported showHostErrorMessage
*/


var app = angular.module('app', ['bm.bsTour','ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel', 'pascalprecht.translate']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider','TourConfigProvider', '$translateProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider,TourConfigProvider, $translateProvider) {
    
TourConfigProvider.set('prefixOptions', false);
        TourConfigProvider.set('prefix', 'bsTour');

    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/resources/i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en-gb');
    $translateProvider.useSanitizeValueStrategy('escape'); 

    $routeProvider.
    when('/', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:screenId', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/screen/:screenId', {
        templateUrl: function() {
          return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:regionId/screen/:screenId', {
        templateUrl: function() {
            return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    }).
    when('/:regionId/screen/:screenId/:newTransaction', {
        templateUrl: function() {
            return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    });

    tmhDynamicLocaleProvider.localeLocationPattern('../vendors/angular-i18n/angular-locale_{{locale}}.js');

    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'request': function(config) {
                $rootScope.loader.loading = true;
                return config || $q.when(config);
            },
            'response': function(response) {

                $rootScope.loader.loading = false;
                return response || $q.when(response);
            },
            'responseError': function(rejection) {

                $rootScope.loader.loading = false;
                return $q.reject(rejection);
            }
        };
    });

}]);

app.run(function($rootScope, $http, $location, $resource,  $cookieStore,tmhDynamicLocale /*, $templateCache*/ , OCAppConfig) {


    if(sessionStorage.username === null || sessionStorage.username === undefined) {
        $location.url('/screen/anonymous');
    }

   $rootScope.$on('$locationChangeStart', function () {
     var screenId = $rootScope.screenId;

     if($rootScope.screenId === undefined){
        $location.url('/screen/anonymous');
     } else if (screenId === 'anonymous'){
             if(sessionStorage.username === null || sessionStorage.username === undefined) {
            $location.url($rootScope.nextURL);
        }
   } else {
     if(sessionStorage.username === null || sessionStorage.username === undefined) {
        $location.url('/screen/anonymous');
     }
   }
   });
   
    //persist few objects at app level
    $rootScope.routeParams = {};
    $rootScope.user = {};
    $rootScope.loader = {
        loading: false
    };
    $rootScope.showHeader = false;

       // default locale
    $rootScope.newlocale = 'en-gb';
    $rootScope.locale = {};
    $rootScope.isCopy = false;
    $rootScope.allData = [];
    OCAppConfig.load();
    $rootScope.resourceData = [];
    $rootScope.resourceURI = [];
    $rootScope.errordata = [];

    $resource('assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
        $rootScope.locale = data;
        tmhDynamicLocale.set($rootScope.newlocale);
    }, function() {});
});

app.factory('anonymousFactory', function($rootScope){
    return {
        navigateToScreen: function($scope, inputComponent){
            if(inputComponent.actionURL === '/login'){
                $rootScope.nextURL = inputComponent.actionURL;
                $rootScope.navigate(inputComponent.actionURL);    
            }else{
               $rootScope.nextURL = inputComponent.actionURL;
                $rootScope.navigate(inputComponent.actionURL);
                if($rootScope.regionId === undefined){
                    var arr = inputComponent.actionURL.split('/');
                    $rootScope.regionId = arr[1];
                }
            }
        }
    };
});

app.factory('dashboardFactory', function($rootScope, anonymousFactory){
    return {
        navigateToScreen: function($scope, inputComponent){
            $rootScope.resourceHref = undefined;
            anonymousFactory.navigateToScreen($scope, inputComponent);
        }
    };
});

app.factory('quotessearchFactory', function($rootScope, resourceFactory, MetaModel, anonymousFactory){
    return {
        actionHandling: function($scope, inputComponent, rootURL, properties, defaultValues){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, rootURL, properties, resourceFactory, defaultValues);
        },
        navigateToScreen: function($scope, inputComponent){
            $rootScope.resourceHref = undefined;
            anonymousFactory.navigateToScreen($scope, inputComponent);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            MetaModel.handleAction($rootScope, $scope, inputComponent.action, inputComponent.actionURL, resource.href, undefined, resourceFactory, undefined);
        }
    };
});

app.factory('autosearchFactory', function($rootScope, quotessearchFactory){
    return {
        actionHandling: function($scope, inputComponent, optionsMap, properties){
            quotessearchFactory.actionHandling($scope, inputComponent, optionsMap, properties);
        },
        navigateToScreen: function($scope, inputComponent){
            quotessearchFactory.navigateToScreen($scope, inputComponent);
        },
        itemActionHandling: function(resource, inputComponent, $scope){
            quotessearchFactory.itemActionHandling(resource, inputComponent, $scope);
        }
    };
});

app.factory('quotescreateFactory', function($rootScope, $location){
    return {
        navigateToTab: function($scope, inputComponent){
            //$rootScope.resourceUrl = resource.href;
            $location.path(inputComponent.actionURL);

        }
    };
});

app.factory('autocreateFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('ownerInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('autoOwnerInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('riskInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('autoRiskInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});


app.factory('additionalInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('premiumInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('autoPremiumInfoFactory', function($rootScope, $location, quotescreateFactory){
    return {
        navigateToTab: function($scope, inputComponent){
            quotescreateFactory.navigateToTab($scope, inputComponent);
        }
    };
});

app.factory('loginFactory', function($rootScope, $filter, $http, growl){
    return {
        navigateToScreen: function($scope, inputComponent){
            $rootScope.showIcon = true;
                 $http({
                    url: 'assets/resources/config/users.json',
                    method: 'GET'
                }).success(function(data) {
                    //extract user
                    var user = [];
                    $rootScope.isAuthSuccess = false;
                    angular.forEach(data.users, function(key) {
                        if (key.name === $scope.resourcesToBind.properties.inputUsername.value && key.password === $scope.resourcesToBind.properties.inputPassword.value) {
                            $rootScope.isAuthSuccess = true;
                            user = key;
                        }
                    });

                    if (!$rootScope.isAuthSuccess) {
                        growl.error($filter('translate')('INVALID_CREDENTIALS'));
                        return false;
                    }
                    $rootScope.user = user;
                    sessionStorage.username = user.name;
                    $rootScope.nextURL = inputComponent.actionURL;
                    $rootScope.navigate(inputComponent.actionURL);  
                }).error(function(data) {
                    $rootScope.showIcon = false;
                    if (data && data.exception) {
                        growl.error(data.exception.message, '30');
                    } else {
                        growl.error($filter('translate')('GENERAL_ERROR'));
                    }
                });
    }
    };
});

app.directive('ckEditor', [function () {
        return {
            require: '?ngModel',
            restrict: 'C',
            link: function (scope, elm, attr, model) {
                var isReady = false;
                var data = [];
                var ck = CKEDITOR.replace(elm[0]);

                function setData() {
                    if (!data.length) {
                        return;
                    }

                    var d = data.splice(0, 1);
                    ck.setData(d[0] || '<span></span>', function () {
                        setData();
                        isReady = true;
                    });
                }

                ck.on('instanceReady', function () {
                    if (model) {
                        setData();
                    }
                });

                elm.bind('$destroy', function () {
                    ck.destroy(false);
                });

                if (model) {
                    ck.on('change', function () {
                        scope.$apply(function () {
                            var data = ck.getData();
                            if (data === '<span></span>') {
                                data = null;
                            }
                            model.$setViewValue(data);
                        });
                    });

                    model.$render = function () {
                        if (model.$viewValue === undefined) {
                            model.$setViewValue(null);
                            model.$viewValue = null;
                        }

                        data.push(model.$viewValue);

                        if (isReady) {
                            isReady = false;
                            setData();
                        }
                    };
                }
            }
        };
    }]);