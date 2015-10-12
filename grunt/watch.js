'use strict';

module.exports = {
 scripts: {
    files: [
    'src/app-clientmanagement/app/**/*.js',
    'src/app-clientmanagement/js/**/*.js',
    'src/app-clientmanagement/assets/css/*.css',
    'src/app-miniquote/app/**/*.js',
    'src/app-miniquote/js/**/*.js',
    'src/app-miniquote/assets/css/*.css',
    'src/app-weather/app/**/*.js',
    'src/app-weather/js/**/*.js',
    'src/app-weather/assets/css/*.css',
    'src/common/**/*.js',
    'src/common/**/*.html',
    'grunt/*.js',
    'tests/**/*.js' ,
    'src/vendors/*',
    'src/common/*',
    'src/assets/css/*' , 
    '!src/vendors/angular/i18n/**'
    ],
    tasks: ['jshint','karma:unit','copy','injector','replace'],
    options: {
      spawn: false,
      livereload:true
    },
  }
};