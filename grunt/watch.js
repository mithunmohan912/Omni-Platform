'use strict';

module.exports = {
 scripts: {
    files: [
    'src/app/**/*.js',
    'src/app/app.js',
    'src/common/**/*.js',
    'grunt/*.js',
    'tests/**/*.js' 
    ],
    tasks: ['jshint','karma:unit'],
    options: {
      spawn: false,
      livereload:true
    },
  },
   html: {
    files: [
     'src/app/**/*.html',
     'src/app/index.html'],
    tasks: ['jshint','karma:unit'],
    options: {
      spawn: false,	
      livereload: true
    }
  },
   inject_into_index: {
    files: ['src/vendors/*','src/common/*','src/assets/css/*' , '!src/vendors/angular/i18n/**'],
    tasks: ['injector','replace'],
    options: {
      spawn: false, 
      livereload: true
    }
  },
  build_dist: {
    files: ['src/vendors/*','src/common/js/*','src/assets/**' , '!src/vendors/angular/i18n/**'],
    tasks: ['copy'],
    options: {
      spawn: false, 
      livereload: true
    }
  }

};