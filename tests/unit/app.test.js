'use strict';

describe('app', function(){
  var $route, $rootScope, $location;
 // var  $httpBackend;
  
  beforeEach(function(){
   angular.mock.module('ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel');
});
   
 beforeEach(function(){
    inject(function($injector){
      $route = $injector.get('$route');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
     // $httpBackend = $injector.get('$httpBackend');
      
     // $httpBackend.when('GET', '../../src/app/views/partials/login.html').respond('');
    });
  });
  
  
describe('A suit for app', function() {  
  
  it('test case to test app', function(){
   // $rootScope.$apply(function() {
   //   $location.path('/');
   // });
	
	// flush the backend to "execute" the request to do the expectedGET assertion.
  //  $httpBackend.flush();
   // expect($location.path()).toBe('/');
  //  expect($route.current.templateUrl).toBe('../../src/app/views/partials/login.html');
   // expect($route.current.controller).toBe('LoginCtrl');
   
  });
 });
 
 
});
