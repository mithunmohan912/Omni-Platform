'use strict';


/*
exported showHostErrorMessage
*/

var app = angular.module('omnichannel', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider) {
  	
    tmhDynamicLocaleProvider.localeLocationPattern('vendors/angular-i18n/angular-locale_{{locale}}.js');
	 
    
}]);

app.run(function($rootScope,  $location,  $cookieStore ) {
	
   $rootScope.$on('$locationChangeStart', function () {
	 
	 if ($cookieStore.get('userid') === null || $cookieStore.get('userid') === undefined) {
            $location.url('/');
       }
   });	
	 $rootScope.showHeader = false;
	
});

function showHostErrorMessage(message, severity) {

    var errorPopup = $('#errorPopup');
    //var errorIcon = $('#errorIcon');

    errorPopup.removeClass('alert-error');
    errorPopup.removeClass('alert-warning');
    errorPopup.removeClass('alert-info');

  
    if (severity === '30') {
        errorPopup.addClass('alert-error');
        //errorIcon.addClass( 'fa-exclamation-triangle' );
    } else if (severity === '20') {
        errorPopup.addClass('alert-remove');
        //errorIcon.addClass( 'fa-warning' );
    } else {
        errorPopup.addClass('alert-info');
        //errorIcon.addClass( 'fa-info' );
    }

    $('#errorMessage').html(message);
    $('#errorPopup').show();
}
