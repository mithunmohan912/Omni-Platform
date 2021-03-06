'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-html-reporter'),
    reporterOutput: 'reports/omnichannel-ui-codereview-report.html'
  },
  all: [
    'Gruntfile.js',
    'src/app-clientmanagement/app/{,*/}*.js',
    'src/app-kitchensink/app/{,*/}*.js',
    'src/app-miniquote/app/{,*/}*.js',
    'src/app-weather/app/{,*/}*.js',
    'src/app-reference/app/{,*/}*.js',
    'src/app-omnichannel/app/{,*/}*.js',
    'src/ocInfra/js/{,*/}*.js',
    'grunt/*.js',
    'tests/unit/*.js',
    'tests/galen/js/*.js',
    'tests/galen/js/pages/*.js',
  ]
};