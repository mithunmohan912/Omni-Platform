'use strict';

module.exports = {
	dev:{
		options: {
				port: 9090,
				hostname: 'localhost',
				base: 'src',
				keepalive: false,
				livereload: true,
				open: {
					target: 'http://localhost:9090/OCConfigurator/#/'
				}
			},
	}
};
