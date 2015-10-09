'use strict';
/*
global forAll,createDriver,session,takeScreenshot,test
*/
/* exported obj */

var domain = 'localhost:8080/#';


/*
A list of all devices that will be used in our tests
*/
var devices = {
    mobile: {
        deviceName: 'mobile',
        size: '450x800',
        tags: ['mobile']
    },
    tablet: {
        deviceName: 'tablet',
        size: '600x800',
        tags: ['tablet']
    },
    desktop: {
        deviceName: 'desktop',
        size: '1100x800',
        tags: ['desktop']
    }
};

/*
A list of all Browsers that will be used in our tests
*/

var browsers = {
  firefox: {
    browserName: 'firefox'
  },
  chrome: {
    browserName: 'chrome'
   }
};

var TEST_USER = {
    username: 'kkdrensk',
    password: 'kkdrensk'
};

/*
This function creates an instance of WebDriver
and stores it in a test session. Later it will be picked up 
by after-test event
*/
function openDriver(url, size , browserName) {
    var driver = createDriver(null, size, browserName);

    session.put('driver', driver);

    // Checking if url is actually a uri or a full url
    if (url !== null) {
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
            url = 'http://' + domain + url;
        }
        driver.get(url);
    }
    else {
        driver.get('http://' + domain);
    }
    return driver;
}

/*
This event will be called after each test.
Here we will close the browser window.
Also in case of test failure we shall make a screenshot 
and attach it to the report
*/
afterTest(function (test) {
    var driver = session.get('driver');
    if (driver !== null) {
        if (test.isFailed()) {
            session.report().info('Screenshot').withAttachment('Screenshot', takeScreenshot(driver));
        }
        driver.quit();
    }
});



function _test(testNamePrefix, url, callback) {
    test(testNamePrefix + ' on ${deviceName} device', function (device) {
        var driver = openDriver(url, device.size, browsers.chrome.browserName);
        callback.call(this, driver, device);
    });
}

function _testBrowser(testNamePrefix, url, callback) {
    test(testNamePrefix + ' on ${browserName} browser', function (browser) {
        var driver = openDriver(url, devices.desktop.size,browser.browserName);
        callback.call(this, driver);
    });
}

/*
This function will be used in our tests in order to create 
a list of tests parameterize for each device that we have defined in the begining
*/
function testOnAllDevices(testNamePrefix, url, callback) {
    forAll(devices, function () {
        _test(testNamePrefix, url, callback);
    });
}

/*
This function is used in order to create a single test for a specific device

function testOnDevice(device, testNamePrefix, url, callback) {
    forOnly({device: device}, function() {
        _test(testNamePrefix, url, callback);
    });
}
*/
/*
This function will be used in our tests in order to create 
a list of tests parameterize for each browser that we have defined in the begining
*/
function testOnAllBrowsers(testNamePrefix, url, callback) {
    forAll(browsers, function () {
        _testBrowser(testNamePrefix, url, callback);
    });
}

/*
    Exporting functions to all other tests that will use this script
*/
var obj = (function () {
    var exports = {};
    exports.devices = devices;
    exports.browsers = browsers;
    exports.openDriver = openDriver;
    exports.testOnAllDevices = testOnAllDevices;
    exports.testOnAllBrowsers = testOnAllBrowsers;
    exports.TEST_USER = TEST_USER;
    return exports;
  })(obj);