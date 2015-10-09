'use strict';

describe('OCRoles', function () {
  var OCRoles;
 
 beforeEach(module('omnichannel'));

  beforeEach(inject(function (_OCRoles_) {
    OCRoles = _OCRoles_;
	OCRoles.load('ROLE_ADMIN', '/dashboard');
  }));

  
describe('A suit for OCRoles Service', function() {  
    it('test case to test OCRoles', function () {
   
     });
  
   }); 

});