'use strict';
//Export Global Functions

describe('HeaderController', function() {



 beforeEach(function(){
   // injecting all required modules ....
     angular.mock.module('ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'ngCookies','omnichannel','pascalprecht.translate');
});


  var $controller;
  var $scope;
  var $rootScope;
  var $location;
  var $http;
  var $resource;
  var $oc_Roles;
  var $tmh_DynamicLocale;
  var $routeParams;
  var $cookieStore;
  var createController;
  var $translate;

  beforeEach(inject(function(_$controller_, _$rootScope_ , _$location_ ,_$http_ ,
                             _$resource_ ,OCRoles,tmhDynamicLocale,_$routeParams_,_$cookieStore_,_$translate_ ){
    // The injector unwraps the underscores (_) from around the parameter names when matching
   
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $location = _$location_;
    $http = _$http_;
    $resource = _$resource_;
    $oc_Roles = OCRoles;
    $tmh_DynamicLocale = tmhDynamicLocale;
    $routeParams = _$routeParams_;
    $cookieStore= _$cookieStore_;
    $translate=_$translate_;

	
	createController = function() {
		$rootScope.showHeader=false;
		$cookieStore.put('userid','kkdrensk');
		$rootScope.routeParams=$routeParams;
            return $controller('HeaderController', {
               '$scope': $scope,'$rootScope': $rootScope,'$http':$http,'$location' : $location, '$cookieStore' :$cookieStore,'$translate' :$translate
            });
        };
	
  }));

  
describe('A suit for HeaderController', function() {
        it('test case to test HeaderController.', function() {
            createController();
            $rootScope.logout();
            expect($cookieStore.userid).not.toEqual('kkdrensk');
        });
    });

    describe('A suit for HeaderController', function() {
        it('test case to test HeaderController for locale change.', function() {
            var localeOpts={};
            var options = [{value:'en-gb', description:'English'},{value:'es-us', description:'Spanish'} ];
            $rootScope.localeOpts=localeOpts;
            $rootScope.localeOpts.options = options;
            $rootScope.newlocale = 'es-us';
            createController();
            $scope.setLocate('en-gb');
            expect($rootScope.newlocale).toEqual('en-gb');
        });
    });

  
 });