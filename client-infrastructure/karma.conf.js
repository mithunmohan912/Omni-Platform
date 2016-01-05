// Karma configuration
// Generated on Sun May 24 2015 14:41:47 GMT+0530 (IST)
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'src/vendors/angular/angular.min.js',
            'src/vendors/jquery/dist/jquery.js',
            'src/vendors/angular-sanitize/angular-sanitize.min.js',
            'src/vendors/angular-route/angular-route.min.js',
            'src/vendors/angular-resource/angular-resource.min.js',
            'src/vendors/angular-cookies/angular-cookies.min.js',
            'src/vendors/restangular/dist/restangular.min.js',
            'src/vendors/lodash/lodash.min.js',
            'src/vendors/angular-ui-select/dist/select.min.js',
            'src/vendors/angular-strap/dist/angular-strap.min.js',
            'src/vendors/angular-strap/dist/angular-strap.tpl.min.js',
            'src/vendors/angular-dynamic-locale/dist/tmhDynamicLocale.js',
            'src/vendors/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/vendors/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js',
            'src/vendors/angular-ui-select/dist/select.min.js',
            'src/vendors/angular-strap/dist/angular-strap.min.js',
            'src/vendors/angular-dynamic-locale/dist/tmhDynamicLocale.js',
            'src/vendors/angular-smart-table/dist/smart-table.min.js',
            'src/vendors/angular-mocks/angular-mocks.js',
            'src/vendors/angular-ui-date/src/date.js',
            'src/vendors/angular-ui-mask/dist/mask.min.js',
            'src/vendors/jquery-ui/jquery-ui.min.js',
            'src/vendors/modernizr/modernizr.js',
            'src/vendors/quick-ng-repeat/quick-ng-repeat.js',
            'src/vendors/jquery-validation/dist/jquery.validate.js',
             'src/vendors/angular-growl/build/angular-growl.js',
			'src/ocInfra/js/*.js',
            'tests/unit/*.js'

        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/app-clientmanagement/**/*.js': ['coverage'],
            'src/app-kitchensink/**/*.js': ['coverage'],
            'src/app-miniquote/**/*.js': ['coverage'],
            'src/app-weather/**/*.js': ['coverage'],
            'src/ocInfra/**/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage', 'html'],

        htmlReporter: {
            outputFile: 'reports/omnichannel-ui-unit-test-report.html',

            // Optional
            pageTitle: 'Omnichannel Unit Tests',
            subPageTitle: 'A full-featured User Interface written in Angular for Omnichannel Solutions'
        },

        coverageReporter: {
            type: 'html',
            dir: 'reports/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};