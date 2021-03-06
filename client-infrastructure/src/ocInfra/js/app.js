'use strict';
/*global ScreenController,LoginController*/

/*
exported showHostErrorMessage
*/



var app = angular.module('omnichannel', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','angular-growl','mgo-angular-wizard','vcRecaptcha']).
config(['$routeProvider', '$locationProvider', '$httpProvider', 'tmhDynamicLocaleProvider','growlProvider', function($routeProvider, $locationProvider, $httpProvider, tmhDynamicLocaleProvider,growlProvider) {

growlProvider.globalTimeToLive(30000);
growlProvider.globalDisableCountDown(true);
growlProvider.onlyUniqueMessages(true);

$routeProvider.
   when('/', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    }).
   when('/login', {
        templateUrl: function() {
            return 'ocInfra/templates/screen.html';
        },
        controller: LoginController
    }).
   when('/:screenId', {
       templateUrl: function(){
           return 'ocInfra/templates/screen.html';
        }, 
          controller: ScreenController
     });
    
    tmhDynamicLocaleProvider.localeLocationPattern('vendors/angular-i18n/angular-locale_{{locale}}.js');
   
    
}]);

app.run(function($rootScope,  $location,  $cookieStore, OCInfraConfig ) {
  
  $rootScope.$on('$locationChangeStart', function (event,newUrl) {
    // register user
    if (newUrl.endsWith('/screen/registerUser') || newUrl.endsWith('/screen/validateEmail') || newUrl.endsWith('/screen/registerUserConfirmed')) {
        return;
    }
    
    // strong authn (hotp & oath)
    if (newUrl.endsWith('/screen/otp')) {
      return;
    } 

    if (sessionStorage.username === null || sessionStorage.username === undefined) {
      $location.url('/');
    }
  });  
  $rootScope.showHeader = false;
  OCInfraConfig.load();
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

app.directive('scrollTo', function ($location, $anchorScroll) {
  return function(scope, element, attrs) {

    element.bind('click', function(event) {
        event.stopPropagation();
        var off = scope.$on('$locationChangeStart', function(ev) {
            off();
            ev.preventDefault();
        });
        var location = attrs.scrollTo;
        $location.hash(location);
        $anchorScroll();
    });

  };
});