'use strict';

/*
global  testOnAllDevices,testOnAllBrowsers,load,devices,checkLayout,LoginPage
*/

load('init.js');
load('pages/LoginPage.js');
load('pages/HomePage.js');


testOnAllDevices('Login page', '/', function (driver, device) {
	performLoginPageTest(driver,device.tags);
	
});

testOnAllBrowsers('Login page', '/', function (driver) {
	performLoginPageTest(driver,devices.desktop.tags);
 });

function performLoginPageTest(driver,tag) {
	
	var loginPage = null;

	logged('Layout Testing: Basic layout check', function () {
		 loginPage = new LoginPage(driver).waitForIt();
    	 checkLayout(driver, 'tests/galen/specs/login-page.spec', tag);
	});

	logged('Layout Testing: Basic layout check with Error Message', function () {
		 loginPage.loginAs({
    			username: 'undefined',
    			password: 'undefined'
    		});
    	 checkLayout(driver, 'tests/galen/specs/login-page.spec', tag);
	});

	

	return;

}