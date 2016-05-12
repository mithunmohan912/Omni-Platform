var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var failFast = require('jasmine-fail-fast');
exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	seleniumPort: 4444,
	specs: ['tests/functional/'], //path to the respective .js file
	capabilities: {

		browserName: 'chrome',
		chromeOptions: {	
  	    binary: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  	    args: [],
  	    extensions: [],
    }  
      /*'browserName': 'phantomjs',       
        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false']
      */
      /*'browserName': 'internet explorer',
        'platform': 'ANY',
        'version': '11',    
      */
    },
    jasmineNodeOpts: {defaultTimeoutInterval: 300000},
    allScriptsTimeout: 400000,
    onPrepare: function() {
	    jasmine.getEnv().addReporter(failFast.init());
    	jasmine.getEnv().addReporter(
    		new Jasmine2HtmlReporter({
    			savePath: 'functionalReports/screenshots',
    			screenshotsFolder: 'images'
    		})
    	);
    }
};