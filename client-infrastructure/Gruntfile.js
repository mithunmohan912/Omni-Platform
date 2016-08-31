'use strict';

module.exports = function(grunt) {

	require('load-grunt-config')(grunt, {
		 data: {
			 pkg: grunt.file.readJSON('package.json')
		 }
	 });

	grunt.loadNpmTasks('grunt-protractor-webdriver');
	grunt.loadNpmTasks('grunt-protractor-runner');
	
	grunt.registerTask('e2e-test', ['protractor:e2e']);
	grunt.registerTask('functional', ['protractor_webdriver:startselenium','protractor:e2e']);	
	grunt.registerTask('runseleniumserver', ['protractor_webdriver:startselenium']);	

	grunt.registerTask('clean_components', ['clean:dist',
			'clean:lib', 'clean:reports' , 'clean:tmp' ]);

	grunt.registerTask('build', ['codereview' ]);

	grunt.registerTask('test', [ 'karma:unit' ]);

	grunt.registerTask('codereview', [ 'jshint' ]);

	grunt.registerTask('startServer', [ 'connect:dev', 'watch' ]);

    grunt.registerTask('buildcss', [ 'sass:dev' ]);

	grunt.registerTask('inject', ['injector','replace']);

	grunt.registerTask('dist', ['ngAnnotate','uglify','cssmin','copy']);

	grunt.registerTask('minifyJS', ['ngAnnotate','uglify']);

	grunt.registerTask('minifyCSS', ['cssmin']);
	
	grunt.registerTask('build4m', ['copy4m']);
	
	grunt.registerTask('buildMobilePkg', ['clean:mobile','copy:dist_mobile','replace:replace_mobile','replace:replace_mobile_appjs','clean:cordova','copy:dist_cordova','clean:mobile']);

	grunt.registerTask('buildOmniMobilePkg', ['clean:mobile','copy:dist_mobile_omnichannel','replace:replace_mobile_omnichannel','replace:replace_mobile_appjs_omnichannel','clean:cordovaomni','copy:dist_cordova_omni','clean:mobile']);



};
