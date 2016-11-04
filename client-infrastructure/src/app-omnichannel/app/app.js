'use strict';

/*global ScreenController*/
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
    
    if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
        $location.url('/screen/anonymous');
    }

    $rootScope.$on('$locationChangeStart', function (event,newUrl) {
        var screenId = $rootScope.screenId;

        // strong authn (hotp & oath)
        if (newUrl.endsWith('/otp') && $rootScope.authnCallbackData !== undefined) {
        	return;
        }

        if($rootScope.screenId === undefined){
            $location.url('/screen/anonymous');
        } else if (screenId === 'anonymous'){
            if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
                $location.url($rootScope.nextURL);
            }
        } else {
            if($rootScope.isAuthSuccess === undefined || $rootScope.isAuthSuccess === false) {
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







