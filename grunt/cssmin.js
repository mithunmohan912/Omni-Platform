'use strict';

module.exports = {
  concat : {
     options: {
       shorthandCompacting: false,
       roundingPrecision: -1,
       report : 'gzip'
     },
       files: {
         'tmp/css/ocInfra.css': ['src/assets/css/*.css']
       }
  },
  cssmin: {
        files: [{
          expand: true,
          cwd: 'tmp/css',
          src: ['ocInfra.css', '!*.min.css'],
          dest: 'tmp/css',
          ext: '.min.css'
        }]
  } 
};