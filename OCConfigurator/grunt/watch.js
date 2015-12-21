'use strict';

module.exports = {
 scripts: {
    files: [
    'src/OCConfigurator/js/**/*.js'
    ],
    tasks: ['connect:dev'],
    options: {
      spawn: false,
      livereload:true
    },
  }
};