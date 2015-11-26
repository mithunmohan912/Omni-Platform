'use strict';

/*global ScreenController*/
/*
exported showHostErrorMessage
*/

var app = angular.module('clientManagement', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider) {
    $routeProvider.
    when('/screen/:screenId', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: ScreenController
    }).
    when('/screen/:screenId/:newTransaction', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: ScreenController
    });
	
    tmhDynamicLocaleProvider.localeLocationPattern('../vendors/angular-i18n/angular-locale_{{locale}}.js');
	 
    
}]);

app.run(function($rootScope, $http, $location, $resource,  $cookieStore,tmhDynamicLocale /*, $templateCache*/ , OCAppConfig) {
	
	
   $rootScope.$on('$locationChangeStart', function () {
	 
	 if ($cookieStore.get('userid') === null || $cookieStore.get('userid') === undefined) {
            $location.url('/');
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

    $resource('ocInfra/assets/resources/i18n/' + $rootScope.newlocale + '.json').get(function(data) {
        $rootScope.locale = data;
        tmhDynamicLocale.set($rootScope.newlocale);
    }, function() {});
	
});


