'use strict';

describe('app', function(){
  var $route, $rootScope, $location;

  
  beforeEach(function(){
   angular.mock.module('ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'mgcrea.ngStrap', 'ngLocale', 'tmh.dynamicLocale', 'colorpicker.module', 'smart-table', 'ui.date','ui.mask', 'QuickList', 'ngCookies','omnichannel');
});
   
 beforeEach(function(){
    inject(function($injector){
      $route = $injector.get('$route');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
    });
  });
  
  
describe('A suit for app', function() {  
  
  it('test case to test app', function(){
     expect($rootScope.showHeader).toEqual(false);
   
  });
 });
 
 
});
