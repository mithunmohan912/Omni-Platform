'use strict';

module.exports = function(grunt) {

	require('load-grunt-config')(grunt);

	grunt.registerTask('clean_components', ['clean:dist',
			'clean:lib', 'clean:reports' , 'clean:tmp' ]);

	grunt.registerTask('build', ['codereview' ]);

	grunt.registerTask('test', [ 'karma:unit' ]);

	grunt.registerTask('codereview', [ 'jshint' ]);

	grunt.registerTask('startServer', [ 'connect:dev', 'watch' ]);

    grunt.registerTask('buildcss', [ 'sass:dist' ]);

	grunt.registerTask('inject', ['injector','replace']);

	grunt.registerTask('dist', ['ngAnnotate','uglify','cssmin','copy']);

	grunt.registerTask('minifyJS', ['ngAnnotate','uglify']);

	grunt.registerTask('minifyCSS', ['cssmin']);
	
	grunt.registerTask('build4m', ['copy4m']);
	
	grunt.registerTask('buildMobilePkg', ['clean:mobile','copy:dist_mobile','replace:replace_mobile']);

};
