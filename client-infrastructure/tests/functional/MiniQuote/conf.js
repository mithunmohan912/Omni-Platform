exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['Scripts/SearchVerifyAsiaQuote.js'],
  capabilities: {
  	    'browserName' : 'chrome'
  		
  		/*'browserName': 'phantomjs',       
        'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false']
      */
  },
  jasmineNodeOpts: {defaultTimeoutInterval: 300000},
  allScriptsTimeout: 400000
};