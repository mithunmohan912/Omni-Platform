'use strict';
//Export Global Functions
/*global DashboardController*/

describe('DashboardController', function() {

 beforeEach(function(){
  // injecting all required modules ....
   angular.mock.module('ngRoute','ngResource','ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap','ngLocale','tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList','ngCookies','omnichannel');
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

  beforeEach(inject(function(_$controller_, _$rootScope_ , _$location_ ,_$http_ ,
                             _$resource_ ,OCRoles,tmhDynamicLocale,_$routeParams_,_$cookieStore_ ){
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
  }));

  
describe('A suit for DashboardController', function() {
    it('test case to test DashboardController.', function() {
		$rootScope.showHeader=false;
		new DashboardController($scope, $rootScope, $routeParams,$location,$http, $resource);
         expect($rootScope.showHeader).toEqual(false);
    });
  });

  
 });