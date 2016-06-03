'use strict';

module.exports = {

  options: {
    // Location of your protractor config file
    configFile: 'tests/functional/MiniQuote/Scripts/conf.js',

    // Do you want the output to use fun colors?
    noColor: false,

    // Set to true if you would like to use the Protractor command line debugging tool
    // debug: true,

      // Additional arguments that are passed to the webdriver command
      args: {
        suites: 'MQ'
      }
    },
    e2e: {
    options: {
      // Stops Grunt process if a test fails
      keepAlive: false
    }
  },
  continuous: {
    options: {
      keepAlive: true
    }
  }

};