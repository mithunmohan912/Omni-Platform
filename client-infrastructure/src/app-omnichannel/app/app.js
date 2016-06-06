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

app.factory('anonymousFactory', function($rootScope, growl, resourceFactory, MetaModel, EnumerationService){
    return {
        navigateToScreen: function($scope, actionURL){
            if(actionURL === '/login'){
                $rootScope.nextURL = actionURL;
                $rootScope.navigate(actionURL);    
            }else{
               $rootScope.nextURL = actionURL;
                $rootScope.navigate(actionURL);
                if($rootScope.regionId === undefined){
                    var arr = actionURL.split('/');
                    $rootScope.regionId = arr[1];
                }
                if($rootScope.regionId!=='us'){
                    new Promise(function(resolve) {
                        MetaModel.actionHandling(undefined, $scope, $rootScope.regionId, $rootScope.screenId, 'create', resourceFactory, undefined, false, resolve);
                    }).then(function(){
                        EnumerationService.loadEnumerationByTab();
                    }); 
                }
            }
        }
    };
});

app.factory('dashboardFactory', function($rootScope, growl, resourceFactory, MetaModel, anonymousFactory){
    return {
        navigateToScreen: function($scope, actionURL){
            $rootScope.resourceHref = undefined;
            anonymousFactory.navigateToScreen($scope, actionURL);
        }
    };
});


app.factory('loginFactory', function($rootScope, $filter, $http, growl){
    return {
        navigateToScreen: function($scope, actionURL){
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
                    $rootScope.nextURL = actionURL;
                    $rootScope.navigate(actionURL);  
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