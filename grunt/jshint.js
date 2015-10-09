'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-html-reporter'),
    reporterOutput: 'reports/omnichannel-ui-codereview-report.html'
  },
  all: [
    'Gruntfile.js',
    'src/app/js/{,*/}*.js',
    'src/common/js/{,*/}*.js',
    'grunt/*.js',
    'tests/unit/*.js',
    'tests/galen/js/*.js',
    'tests/galen/js/pages/*.js',
  ]
};