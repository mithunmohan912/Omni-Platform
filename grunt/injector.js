'use strict';

module.exports = {
	injector : {
		options : {
			relative : true,
			min : true
		} ,
		files : {
			'src/app-clientmanagement/index.html' : ['src/app-clientmanagement/js/*.js','src/app-clientmanagement/js/**/*.js','src/app-clientmanagement/assets/css/*.css',
			                                         'src/app-clientmanagement/ocinfra/js/ocInfra.js','src/app-clientmanagement/ocinfra/css/ocInfra.css'],
			'src/app-miniquote/index.html' : ['src/app-miniquote/js/*.js','src/app-miniquote/assets/css/*.css',
			                                  'src/app-miniquote/ocinfra/js/ocInfra.js','src/app-miniquote/ocinfra/css/ocInfra.css'],
			'src/app-weather/index.html' : ['src/app-weather/js/*.js','src/app-weather/assets/css/*.css',
			                                'src/app-weather/ocinfra/js/ocInfra.js','src/app-weather/ocinfra/css/ocInfra.css' ]
		}
		
	} ,
	bower_injector : {
		options : {
			relative : true,
			min : true,
			starttag : '<!-- bower_injector:{{ext}} -->' ,
			endtag : '<!-- endbower_injector -->'
		} ,
		files : {
			'src/app-clientmanagement/index.html' : ['bower.json'],
			'src/app-miniquote/index.html' : ['bower.json'],
			'src/app-weather/index.html' : ['bower.json'],
		}
	}
};