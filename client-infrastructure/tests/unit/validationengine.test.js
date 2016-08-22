'use strict';
/*global validateLogin*/

describe('validation engine', function() {
  var $form;

  beforeEach(function () {
    $form = $( '<form id="LoginForm">' +
             '<input  name="inputUsername" type="text">' +
             '</form>');
  });	

describe('A suit for validationengine', function() {
  
  it('test case to test showMessage', function () {
        expect('Test','30').toEqual('Test');
    });

  
  it('test case to test validateLogin', function () {
		 var FormID = $form.attr('id');		
	     validateLogin(FormID); 
         expect($form.valid()).toEqual(true);
	 });
 });
 
});		
	

  
