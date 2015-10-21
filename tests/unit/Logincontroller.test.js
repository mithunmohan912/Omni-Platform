'use strict';
//Export Global Functions
/*global LoginController*/

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
  var LoginSrv;
  var $cookieStore;
  var createController;
  var FieldService;
  var OCMetadata;
  var OCInfraConfig;

  beforeEach(inject(function(_$controller_, _$rootScope_ , _$location_ , _$cookieStore_,_$http_ ,
                             _$resource_ ,OCRoles,tmhDynamicLocale,_LoginSrv_,_FieldService_,_OCInfraConfig_,_OCMetadata_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
   
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $location = _$location_;
    $http = _$http_;
    $resource = _$resource_;
    $oc_Roles = OCRoles;
    $tmh_DynamicLocale = tmhDynamicLocale;
    LoginSrv = _LoginSrv_;
    $cookieStore= _$cookieStore_;
    FieldService = _FieldService_;
    OCMetadata = _OCMetadata_;
    OCInfraConfig = _OCInfraConfig_;
	
	createController = function() {
    new LoginController($scope, $rootScope, $location, $cookieStore, $http, $resource, $oc_Roles, $tmh_DynamicLocale,LoginSrv,FieldService,OCInfraConfig,OCMetadata);	
        };
	
  }));

  
describe('A suit for LoginController', function() {
    it('test case to test LoginController.', function() {
		createController();
        expect($cookieStore.userid).not.toEqual('kkdrensk');
    });
  });

});