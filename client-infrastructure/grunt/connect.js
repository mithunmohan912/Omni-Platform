'use strict';

module.exports = {
	dev:{
		options: {
				port: 8080,
				hostname: 'localhost',
				base: 'src',
				keepalive: false,
				livereload: true,
				open: {
					target: 'http://localhost:8080/app-miniquote/#/'
				}
			},
	}
};
