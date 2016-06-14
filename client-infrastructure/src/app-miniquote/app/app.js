'use strict';

/*global ScreenController,AnonymousController,LoginController,CKEDITOR*/
/*
exported showHostErrorMessage
*/


var app = angular.module('miniQuote', ['bm.bsTour','ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider','TourConfigProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider,TourConfigProvider) {
    
TourConfigProvider.set('prefixOptions', false);
        TourConfigProvider.set('prefix', 'bsTour');

    $routeProvider.
    when('/', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: AnonymousController
    }).
    when('/login', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    }).
    when('/:regionId/screen/:screenId', {

        templateUrl: function() {
          return 'ocInfra/templates/screen.html';
        },
        controller: ScreenController
    }).
    when('/:regionId/screen/:screenId/:newTransaction', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: ScreenController
    });

    tmhDynamicLocaleProvider.localeLocationPattern('../vendors/angular-i18n/angular-locale_{{locale}}.js');

    $httpProvider.interceptors.push(function($q, $rootScope, growl) {

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

                 if(rejection.status == "-1")
                 {
                    growl.error("Gateway Timedout/InSecure Response");

                 }
                $rootScope.loader.loading = false;
                return $q.reject(rejection);
            }
        };
    });
}]);

app.run(function($rootScope, $http, $location, $resource,  $cookieStore,tmhDynamicLocale /*, $templateCache*/ , OCAppConfig) {


   $rootScope.$on('$locationChangeStart', function () {
     var screenId = $rootScope.screenId;

     if($rootScope.screenId === undefined){
        $location.url('/');
     } else if (screenId === 'anonymous'){
             if(sessionStorage.username === null || sessionStorage.username === undefined) {
            $location.url($rootScope.nextURL);
        }
   } else {
     if(sessionStorage.username === null || sessionStorage.username === undefined) {
        $location.url('/');
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






