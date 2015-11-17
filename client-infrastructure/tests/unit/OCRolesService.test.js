'use strict';

describe('OCRoles', function () {
  var OCRoles;
  var $resource, $rootScope, $location;
 
 beforeEach(module('omnichannel'));

  beforeEach(inject(function (_OCRoles_, _$resource_ ,_$rootScope_ , _$location_) {
    OCRoles = _OCRoles_;
	$resource =  _$resource_;
	$rootScope = _$rootScope_;
	$location = _$location_;
	
	OCRoles.load('ROLE_BROKER', '/dashboard');
  }));

  
describe('A suit for OCRoles Service', function() {  
    it('test case to test OCRoles', function () {
		expect($rootScope.roleConfig).toEqual(undefined);
     });
  
   }); 

});