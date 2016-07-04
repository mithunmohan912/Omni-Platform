'use strict';

/*global ScreenController*/
/*
exported showHostErrorMessage
*/


var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel', 'pascalprecht.translate']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider', '$translateProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider, $translateProvider) {
    $routeProvider.when('/screen/:screenId', {
        templateUrl: function() {
            return 'ocInfra/templates/components/screen.html';
        },
        controller: ScreenController
    });
	
    tmhDynamicLocaleProvider.localeLocationPattern('../vendors/angular-i18n/angular-locale_{{locale}}.js');
	
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/resources/i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en-gb');
    $translateProvider.useSanitizeValueStrategy('escape'); 

    $httpProvider.interceptors.push(function($q, $rootScope) {

        return {
            'request': function(config) {
                if (!$rootScope.requestCounter) {
                    $rootScope.requestCounter = 0;
                }
                $rootScope.requestCounter++;
                $rootScope.loader.loading = true;
                return config || $q.when(config);
            },
            'response': function(response) {
                $rootScope.requestCounter--;
                if ($rootScope.requestCounter <= 0) {
                    $rootScope.loader.loading = false;
                }
                return response || $q.when(response);
            },

            'responseError': function(rejection) {
                $rootScope.requestCounter--;
                if ($rootScope.requestCounter <= 0) {
                    $rootScope.loader.loading = false;
                }
                if (rejection.data && rejection.data.messages) {
                    $rootScope.errordata = rejection.data.messages;
                    $rootScope.showError = true;
                }
                return $q.reject(rejection);
            }
        };
    });
    
}]);

app.run(function($rootScope, OCAppConfig, $location, $cookieStore, MetaModel) {
    // FIXME: Headers to null in order to use real AIA API
    MetaModel.setHeaders = function($rootScope){
        $rootScope.headers = {
                'Accept': 'application/vnd.hal+json', 
                'Content-Type': 'application/json', 
                'NSP_USERID': 'kkdrensk', 
                'Accept-Language': 'en'
        };
    };
    //FIXME. remove when having a login controller
    $cookieStore.remove('userid');
    if ($cookieStore.get('userid') === null || $cookieStore.get('userid') === undefined) {
            $location.url('/screen/dashboard');
    } 

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
    //FIXME. remoce when having a login controller
    $cookieStore.put('userid', 'kkdrensk');
    sessionStorage.username = 'kkdrensk';
    $rootScope.currRel = 'undefined';

});
    






