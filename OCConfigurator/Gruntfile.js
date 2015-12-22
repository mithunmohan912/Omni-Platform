'use strict';

module.exports = function(grunt) {

	require('load-grunt-config')(grunt);
	grunt.registerTask('startServer', [ 'connect:dev', 'watch']);
};
