'use strict';
//Export Global Functions


describe('LoginController', function() {

 beforeEach(function(){
  // injecting all required modules ....
     angular.mock.module('ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel');
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
 // var httpMock;
  var httpBackend;
//  var url = 'http://localhost:8080/#/';
 // var browser = new Browser();

  beforeEach(inject(function(_$controller_, _$rootScope_ , _$location_ ,_$http_ ,
                             _$resource_ ,OCRoles,tmhDynamicLocale,_$routeParams_,_$cookieStore_,$httpBackend ){
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
	//httpMock = $httpMock;
	httpBackend = $httpBackend;
  }));

  
describe('A suit for LoginController', function() {
    it('test case to test validate login.', function() {
		
		//new LoginController($scope, $rootScope, $cookieStore, $http, $resource, $oc_Roles, $tmh_DynamicLocale);
       // expect($rootScope.showHeader).toEqual(false);
	
	//	 httpMock.flush();
		 
    });
  });

  
 });