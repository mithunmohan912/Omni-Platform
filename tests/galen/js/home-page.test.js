'use strict';

/*
global  testOnAllDevices,testOnAllBrowsers,load,devices,TEST_USER,checkLayout,LoginPage,HomePage
*/

load('init.js');
load('pages/LoginPage.js');
load('pages/HomePage.js');


testOnAllDevices('Home page', '/', function (driver, device) {
	performHomePageTest(driver,device.tags);
	
});

testOnAllBrowsers('Home page', '/', function (driver) {
	performHomePageTest(driver,devices.desktop.tags);
 });

function performHomePageTest(driver,tag) {
	
	var loginPage = null;
	var homePage = null;

	logged('Functional Testing: Login to Page', function () {
		loginPage = new LoginPage(driver).waitForIt();
		loginPage.loginAs(TEST_USER);

	});
	
	logged('Layout Testing: Header', function () {
		homePage = new HomePage(driver).waitForIt();
		checkLayout(driver,'tests/galen/specs/header.spec',tag);
	});
	
	logged('Layout Testing: Footer', function () {
		homePage = new HomePage(driver).waitForIt();
		checkLayout(driver,'tests/galen/specs/footer.spec',tag);
	});

	return;

}